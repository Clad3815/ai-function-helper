const { createAiFunctionInstance } = require('ai-function-helper');
// Using LiteLLM endpoint to access to all models provided by OpenAI / Anthropic / Google / Ollama / Etc ...
// https://github.com/BerriAI/litellm
const aiFunction = createAiFunctionInstance("sk-1234", "http://127.0.0.1:4000/v1");
const { z } = require('zod');
const math = require('mathjs');

const fs = require('fs');
// List of models to test
// const models = ['claude-3-haiku-20240307', 'gpt-3.5-turbo', 'gpt-4o', 'claude-3-5-sonnet-20240620', 'gemini-1.5-flash', 'gemini-1.5-pro', 'llama3', 'gemma2'];
const models = ['gpt-3.5-turbo', 'gpt-4o'];

const globalOptions = {
    // showDebug: true,
    // debugLevel: 2,
    temperature: 0,
    max_tokens: 4000
};


// Test cases
const testCases = [
    {
        name: 'Complex calculation',
        options: {
            functionName: 'calculate',
            args: {
                expression: '15*87 + ( 129/ (48*0.5) ) +12'
            },
            description: 'Calculate a complex mathematical expression. Include your chain of thought in the response to explain how you arrived at the result.',
            funcReturn: z.object({
                chain_of_thought: z.string().describe('The chain of thought used to calculate the result. Explain step by step, operation by operation (Never more than 2 numbers together) with their result at each step to improve your answer. Put it in a nice markdown format point by point'),
                result: z.number().describe('The result of the calculation.')
            })
        },
        additionalChecks: (result, args) => {
            const expected = 15 * 87 + (129 / (48 * 0.5)) + 12;
            if (result.result !== expected) {
                throw new Error(`Result '${result.result}' is not equal to the expected value: ${expected}`);
            }
        }
    },
    {
        name: 'Generate fake people',
        options: {
            functionName: 'fake_people',
            args: { count_people: 3 },
            description: 'Generates n examples of fake data representing people, each with a name and an age. Each data must look realistic.',
            funcReturn: z.object({
                peoples: z.array(z.object({
                    name: z.string().describe('The name of the person'),
                    age: z.number().int().positive().describe('The age of the person'),
                }))
            })
        },
        additionalChecks: (result, args) => {
            if (result.peoples.length !== 3) {
                console.log(result);
                throw new Error('Result length is not equal to the number of people requested');
            }
        }
    },
    {
        name: 'Calculate the nth prime number',
        options: {
            functionName: 'get_nth_prime_number',
            args: 10,
            description: 'Finds and returns the nth prime number.',
            funcReturn: z.object({
                primeNumber: z.number().int().positive().describe('The nth prime number')
            })
        },
        additionalChecks: (result, args) => {
            const expectedPrimeNumber = 29;
            if (result.primeNumber !== expectedPrimeNumber) {
                console.log(result);
                throw new Error(`Result is not equal to the expected nth prime number, which is: ${expectedPrimeNumber}`);
            }
        }
    },
    {
        name: 'Find capital cities',
        options: {
            functionName: 'get_capital_city',
            args: { country: 'Italy' },
            description: 'This function should return the capital city of the given country.',
            funcReturn: z.object({
                result: z.string().describe('The capital city of the given country')
            })
        },
        additionalChecks: (result, args) => {
            if (result.result !== 'Rome') {
                console.log(result);
                throw new Error('Result is not the correct capital city for the given country');
            }
        }
    },
    {
        name: 'Grammar Correction',
        options: {
            functionName: 'correct_grammar',
            args: { sentence: 'He are a good person' },
            description: 'This function should correct the grammar of the given sentence.',
            funcReturn: z.object({
                result: z.string().describe('The grammatically corrected sentence')
            })
        },
        additionalChecks: (result, args) => {
            if (result.result !== 'He is a good person' && result.result !== 'He is a good person.') {
                console.log(result);
                throw new Error('Result is not the grammatically correct version of the input sentence');
            }
        }
    },
    {
        name: 'Detect language in a text',
        options: {
            functionName: 'detect_language',
            args: { text: 'Hola, ¿cómo estás?' },
            description: 'This function should detect the language of the provided text and return the language code.',
            funcReturn: z.object({
                result: z.string().describe('The detected language code')
            })
        },
        additionalChecks: (result, args) => {
            if (result.result !== 'es') {
                console.log(result);
                throw new Error('Result is not the correct language code for the input');
            }
        }
    },
    {
        name: 'Calculate area of triangle (with mathjs expression)',
        options: {
            functionName: 'calculate',
            args: {
                userRequest: 'Calculate the area of this triangle',
                base: 179.74,
                height: 177.76,
            },
            description: 'Calculate something based on the user request. Return a mathjs expression to calculate the area. No variables should be used in the expression, only numerical values.',
            funcReturn: z.object({
                calculation: z.string().describe('A mathjs expression to calculate. No variables allowed.')
            })
        },
        additionalChecks: (result, args) => {
            const { calculation } = result;
            let calculatedArea = math.evaluate(calculation);
            const expectedArea = math.multiply(179.74, 177.76, 0.5);
            if (math.abs(math.subtract(calculatedArea, expectedArea)) > 0.0001) {
                throw new Error(`Calculated area ${calculatedArea} is not equal to the expected area of the triangle, which is: ${expectedArea}`);
            }
        }
    },
    {
        name: 'Generate Quiz',
        options: {
            functionName: 'generate_quiz',
            args: { topic: 'space exploration', difficulty: 'medium', num_questions: 2 },
            description: 'Generate a quiz with multiple-choice questions on the given topic.',
            funcReturn:
                z.object({
                    questions: z.array(
                        z.object({
                            question: z.string().describe("The question text"),
                            options: z.array(z.string().describe("A possible answer to the question"))
                                .length(4)
                                .describe("An array of four possible answers"),
                            correct_answer: z.string().describe("The correct answer to the question")
                        })
                    )
                })
        }
    },
    {
        name: 'Create Recipe',
        options: {
            functionName: 'create_recipe',
            args: { ingredients: ['chicken', 'spinach', 'feta cheese', 'olive oil'], cuisine: 'Mediterranean' },
            description: 'Create a recipe using the provided ingredients and cuisine style.',
            funcReturn: z.object({
                name: z.string().describe("The name of the dish"),
                ingredients: z.array(z.string().describe("An ingredient with its quantity")).describe("List of ingredients with quantities"),
                instructions: z.array(z.string().describe("A step in the cooking process")).describe("Step-by-step cooking instructions"),
                prep_time: z.string().describe("Preparation time (e.g., '10 minutes')"),
                cook_time: z.string().describe("Cooking time (e.g., '20 minutes')"),
                servings: z.number().int().describe("Number of servings the recipe yields")
            })
        }
    },
    {
        name: 'Generate Travel Itinerary',
        options: {
            functionName: 'create_travel_itinerary',
            args: { destination: 'Tokyo', duration: 5, interests: ['technology', 'food', 'history'] },
            description: 'Create a daily travel itinerary for the specified destination and duration, considering the traveler\'s interests.',
            funcReturn: z.object({
                destination: z.string().describe("The travel destination"),
                duration: z.number().int().describe("Number of days for the trip"),
                daily_plans: z.array(
                    z.object({
                        day: z.number().int().describe("Day number of the trip"),
                        activities: z.array(
                            z.object({
                                time: z.string().describe("Time of the activity"),
                                activity: z.string().describe("Name of the activity"),
                                description: z.string().describe("Brief description of the activity")
                            })
                        ).describe("List of activities for the day")
                    })
                ).describe("Daily itinerary for each day of the trip")
            })
        }
    },
    {
        name: 'Analyze Sentiment of Customer Reviews',
        options: {
            functionName: 'analyze_reviews',
            args: {
                reviews: [
                    "The product exceeded my expectations. Great value for money!",
                    "Disappointed with the quality. Wouldn't recommend.",
                    "Average product, nothing special but does the job.",
                    "Absolutely love it! Will buy again.",
                    "mf didnt show up"

                ]
            },
            description: 'Analyze the sentiment of customer reviews and categorize them.',
            funcReturn: z.object({
                analyze: z.array(
                    z.object({
                        review: z.string().describe("The original review text"),
                        sentiment: z.enum(["positive", "neutral", "negative"]).describe("The sentiment category of the review"),
                        score: z.number().min(0).max(1).describe("Sentiment score between 0 (most negative) and 1 (most positive)")
                    })
                )
            })
        }
    },
    {
        name: 'Generate Short Story',
        options: {
            functionName: 'write_short_story',
            args: {
                genre: 'science fiction',
                theme: 'first contact with aliens',
                wordCount: 150
            },
            description: 'Write a short story based on the given genre, theme, and approximate word count.',
            funcReturn: z.object({
                title: z.string().describe("The title of the short story"),
                story: z.string().describe("The full text of the short story"),
                wordCount: z.number().int().describe("The actual word count of the story")
            })
        }
    },
    {
        name: 'Create Workout Plan',
        options: {
            functionName: 'create_workout_plan',
            args: {
                fitnessLevel: 'intermediate',
                goal: 'muscle gain',
                daysPerWeek: 4,
                equipmentAvailable: ['dumbbells', 'barbell', 'pull-up bar']
            },
            description: 'Create a weekly workout plan based on the user\'s fitness level, goal, available days, and equipment.',
            funcReturn: z.object({
                weeklyPlan: z.array(
                    z.object({
                        day: z.number().int().describe("Day number of the workout"),
                        focus: z.string().describe("Main focus of the workout (e.g., 'Chest and Triceps')"),
                        exercises: z.array(
                            z.object({
                                name: z.string().describe("Name of the exercise"),
                                sets: z.number().int().describe("Number of sets"),
                                reps: z.string().describe("Number of repetitions (e.g., '8-10' or '12')"),
                                rest: z.string().describe("Rest time between sets (e.g., '60 seconds')")
                            })
                        ).describe("List of exercises for the workout")
                    })
                ).describe("Workout plan for each day of the week")
            })
        }
    },
    {
        name: 'Summarize Long Text',
        options: {
            functionName: 'summarize_text',
            args: {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                maxLength: 50
            },
            description: 'Summarize the given text, keeping the summary within the specified maximum length in words.',
            funcReturn: z.object({
                summary: z.string().describe("The summarized text"),
                wordCount: z.number().int().describe("The actual word count of the summary")
            })
        }
    },
    {
        name: 'Generate Complex Product Catalog',
        options: {
            functionName: 'generate_product_catalog',
            args: {
                categories: ['Electronics', 'Home & Garden', 'Sports'],
                productsPerCategory: 2,
                includeReviews: true
            },
            description: 'Generate a complex product catalog with nested categories, product details, and customer reviews.',
            funcReturn: z.object({
                catalog: z.array(z.object({
                    category: z.string(),
                    products: z.array(z.object({
                        id: z.string(),
                        name: z.string(),
                        price: z.number().positive(),
                        description: z.string().max(500),
                        specifications: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
                        inStock: z.boolean(),
                        tags: z.array(z.string()),
                        reviews: z.array(z.object({
                            userId: z.string(),
                            rating: z.number().int().min(1).max(5),
                            comment: z.string().max(200),
                            helpful: z.number().int().nonnegative(),
                            date: z.string().datetime()
                        })).max(5),
                        relatedProducts: z.array(z.string()).max(3).optional()
                    })).max(5)
                }))
            })
        }
    },
    {
        name: 'Generate Advanced Chess Game Analysis',
        options: {
            functionName: 'analyze_chess_game',
            args: {
                pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7",
                depth: 20,
                evaluatePositions: true
            },
            description: 'Analyze a chess game, providing detailed move analysis, positional evaluation, and strategic insights.',
            funcReturn: z.object({
                gameInfo: z.object({
                    event: z.string().optional(),
                    site: z.string().optional(),
                    date: z.string().optional(),
                    round: z.string().optional(),
                    white: z.string(),
                    black: z.string(),
                    result: z.enum(['1-0', '0-1', '1/2-1/2', '*'])
                }),
                moves: z.array(z.object({
                    moveNumber: z.number().int().positive(),
                    white: z.object({
                        san: z.string(),
                        uci: z.string(),
                        comment: z.string().optional(),
                        nag: z.array(z.number().int()).optional(),
                        evaluation: z.number().optional(),
                        bestMove: z.string().optional()
                    }),
                    black: z.object({
                        san: z.string(),
                        uci: z.string(),
                        comment: z.string().optional(),
                        nag: z.array(z.number().int()).optional(),
                        evaluation: z.number().optional(),
                        bestMove: z.string().optional()
                    }).optional()
                })),
                analysis: z.object({
                    openingName: z.string(),
                    openingEco: z.string(),
                    middlegameAnalysis: z.string(),
                    endgameAnalysis: z.string().optional(),
                    keyPositions: z.array(z.object({
                        fen: z.string(),
                        evaluation: z.number(),
                        bestMove: z.string(),
                        comment: z.string()
                    })),
                    tacticalMotifs: z.array(z.object({
                        type: z.enum(['fork', 'pin', 'skewer', 'discovery', 'zwischenzug', 'zugzwang']),
                        moveNumber: z.number().int().positive(),
                        description: z.string()
                    })),
                    strategicThemes: z.array(z.string()),
                    blunders: z.array(z.object({
                        moveNumber: z.number().int().positive(),
                        move: z.string(),
                        evaluationBefore: z.number(),
                        evaluationAfter: z.number(),
                        bestMove: z.string(),
                        explanation: z.string()
                    }))
                }),
                engineAnalysis: z.object({
                    engineName: z.string(),
                    depth: z.number().int().positive(),
                    totalPositionsEvaluated: z.number().int().positive(),
                    averageDepth: z.number(),
                    timeSpent: z.number().positive(),
                    nodesPerSecond: z.number().int().positive()
                })
            })
        }
    },
    {
        name: 'Analyze Stock Market Data',
        options: {
            functionName: 'analyze_stock_market',
            args: {
                stockSymbol: 'AAPL',
                historicalData: [
                    { date: '2023-01-01', open: 130.28, high: 132.49, low: 128.72, close: 131.86, volume: 70172294 },
                    { date: '2023-04-01', open: 162.44, high: 165.00, low: 161.08, close: 164.90, volume: 59279000 },
                    { date: '2023-07-01', open: 191.63, high: 194.48, low: 190.62, close: 193.97, volume: 52722800 },
                    { date: '2023-10-01', open: 171.04, high: 173.07, low: 169.93, close: 172.88, volume: 51861900 },
                    { date: '2023-12-31', open: 191.57, high: 195.41, low: 190.62, close: 193.60, volume: 55285001 }
                ],
                marketIndices: {
                    'S&P500': [
                        { date: '2023-01-01', value: 3839.50 },
                        { date: '2023-04-01', value: 4109.31 },
                        { date: '2023-07-01', value: 4450.38 },
                        { date: '2023-10-01', value: 4288.05 },
                        { date: '2023-12-31', value: 4769.83 }
                    ],
                    'NASDAQ': [
                        { date: '2023-01-01', value: 10466.48 },
                        { date: '2023-04-01', value: 12221.91 },
                        { date: '2023-07-01', value: 13787.92 },
                        { date: '2023-10-01', value: 13219.32 },
                        { date: '2023-12-31', value: 15011.35 }
                    ]
                },
                economicIndicators: {
                    interestRates: [
                        { date: '2023-01-01', value: 4.5 },
                        { date: '2023-04-01', value: 4.75 },
                        { date: '2023-07-01', value: 5.0 },
                        { date: '2023-10-01', value: 5.25 },
                        { date: '2023-12-31', value: 5.25 }
                    ],
                    inflation: [
                        { date: '2023-01-01', value: 6.5 },
                        { date: '2023-04-01', value: 5.0 },
                        { date: '2023-07-01', value: 3.2 },
                        { date: '2023-10-01', value: 3.7 },
                        { date: '2023-12-31', value: 3.4 }
                    ]
                }
            },
            description: 'Analyze quarterly stock market data for a given stock, including historical prices, market indices, and economic indicators. Provide insights and predictions.',
            funcReturn: z.object({
                stockAnalysis: z.object({
                    symbol: z.string(),
                    currentPrice: z.number(),
                    yearlyPerformance: z.number(),
                    volatility: z.number(),
                    beta: z.number(),
                    movingAverages: z.object({
                        SMA: z.number(),
                        EMA: z.number()
                    }),
                    technicalIndicators: z.object({
                        RSI: z.number(),
                        MACD: z.object({
                            value: z.number(),
                            signal: z.number(),
                            histogram: z.number()
                        })
                    })
                }),
                marketComparison: z.object({
                    correlationWithSP500: z.number(),
                    correlationWithNASDAQ: z.number(),
                    relativeStrength: z.number()
                }),
                fundamentalAnalysis: z.object({
                    peRatio: z.number(),
                    pbRatio: z.number(),
                    dividendYield: z.number().optional(),
                    earningsGrowth: z.number()
                }),
                economicImpact: z.object({
                    interestRateSensitivity: z.number(),
                    inflationImpact: z.number()
                }),
                prediction: z.object({
                    nextQuarterEstimate: z.number(),
                    confidenceInterval: z.tuple([z.number(), z.number()]),
                    potentialRisks: z.array(z.string()),
                    potentialOpportunities: z.array(z.string())
                })
            })
        }
    },
    {
        name: 'Analyze Social Media Campaign',
        options: {
            functionName: 'analyze_social_media_campaign',
            args: {
                campaignName: 'Summer Sale 2023',
                platforms: ['Facebook', 'Instagram', 'Twitter'],
                duration: { startDate: '2023-06-01', endDate: '2023-08-31' },
                budget: 50000,
                targetAudience: { ageRange: [18, 35], interests: ['Fashion', 'Technology'] },
                posts: [
                    {
                        platform: 'Facebook',
                        date: '2023-06-15',
                        content: 'Check out our amazing summer deals!',
                        engagement: { likes: 1500, shares: 300, comments: 75 },
                        reach: 50000,
                        clicks: 2000
                    },
                    {
                        platform: 'Instagram',
                        date: '2023-07-01',
                        content: 'Summer vibes with our new collection!',
                        engagement: { likes: 3000, comments: 150 },
                        reach: 75000,
                        clicks: 3500
                    },
                    {
                        platform: 'Twitter',
                        date: '2023-07-15',
                        content: 'Flash sale alert! 24 hours only!',
                        engagement: { likes: 500, retweets: 200, replies: 50 },
                        reach: 30000,
                        clicks: 1500
                    },
                    {
                        platform: 'Facebook',
                        date: '2023-08-01',
                        content: 'Last chance for summer savings!',
                        engagement: { likes: 2000, shares: 400, comments: 100 },
                        reach: 60000,
                        clicks: 2500
                    }
                ],
                conversionData: {
                    totalSales: 150000,
                    newCustomers: 2000,
                    averageOrderValue: 75
                }
            },
            description: 'Analyze the performance of a social media marketing campaign across multiple platforms. Provide insights on engagement, reach, and ROI.',
            funcReturn: z.object({
                overallPerformance: z.object({
                    totalReach: z.number(),
                    totalEngagement: z.number(),
                    engagementRate: z.number(),
                    clickThroughRate: z.number(),
                    conversionRate: z.number(),
                    ROI: z.number()
                }),
                platformBreakdown: z.array(z.object({
                    platform: z.string(),
                    reach: z.number(),
                    engagement: z.number(),
                    engagementRate: z.number(),
                    clicks: z.number(),
                    CTR: z.number()
                })),
                contentAnalysis: z.object({
                    topPerformingPost: z.object({
                        platform: z.string(),
                        content: z.string(),
                        engagement: z.number()
                    }),
                    contentSentiment: z.object({
                        positive: z.number(),
                        neutral: z.number(),
                        negative: z.number()
                    })
                }),
                audienceInsights: z.object({
                    mostEngagedAgeGroup: z.string(),
                    topInterests: z.array(z.string()),
                    peakEngagementTimes: z.array(z.string())
                }),
                recommendations: z.array(z.object({
                    category: z.enum(['Content', 'Targeting', 'Budget', 'Platform']),
                    suggestion: z.string(),
                    expectedImpact: z.string()
                }))
            })
        }
    }
];

async function runTests() {
    const results = {};
    const apiResponses = {};

    for (const model of models) {
        results[model] = [];
        apiResponses[model] = [];

        for (const testCase of testCases) {
            const args = typeof testCase.options.args === 'function' ? testCase.options.args() : testCase.options.args;
            const options = { ...testCase.options, args, ...globalOptions, model };

            const startTime = Date.now();
            try {
                const result = await aiFunction(options);
                const endTime = Date.now();
                const duration = endTime - startTime;

                // Perform additional checks
                if (testCase.additionalChecks) {
                    testCase.additionalChecks(result, args);
                }
                results[model].push({
                    name: testCase.name,
                    success: true,
                    duration: duration,
                    result: result
                });
                apiResponses[model].push({
                    name: testCase.name,
                    success: true,
                    response: result
                });
                console.log(`${model} - ${testCase.name}: ✅ Success (${duration}ms)`);
            } catch (error) {
                // console.error(error);
                const endTime = Date.now();
                const duration = endTime - startTime;
                results[model].push({
                    name: testCase.name,
                    success: false,
                    error: error.message,
                    duration: duration
                });
                apiResponses[model].push({
                    name: testCase.name,
                    success: false,
                    error: error.message
                });
                console.error(`${model} - ${testCase.name}: ❌ Failure (${duration}ms)`);
            }
        }
    }

    return { results, apiResponses };
}


function formatError(error) {
    if (typeof error === 'string') {
        // If it's a simple string, just return it
        return error;
    } else if (Array.isArray(error)) {
        // If it's an array (like Zod validation errors), format it
        return error.map(err =>
            `- ${err.path.join('.')}: ${err.message}`
        ).join('<br>');
    } else if (typeof error === 'object') {
        // If it's an object, stringify it
        return JSON.stringify(error, null, 2).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
    }
    // If it's none of the above, convert to string
    return String(error);
}

function generateMarkdownReport(results) {
    let report = '# AI Function Test Results\n\n';

    // Summary table
    report += '## Summary\n\n';
    report += '| Model | Success Rate | Average Duration |\n';
    report += '|-------|--------------|------------------|\n';

    for (const model of models) {
        const modelResults = results[model];
        const successCount = modelResults.filter(r => r.success).length;
        const successRate = (successCount / modelResults.length * 100).toFixed(2);
        const avgDuration = (modelResults.reduce((sum, r) => sum + r.duration, 0) / modelResults.length).toFixed(2);
        report += `| ${model} | ${successRate}% | ${avgDuration}ms |\n`;
    }

    report += '\n';

    // Detailed results for each model
    for (const model of models) {
        report += `## ${model} Detailed Results\n\n`;
        report += '| Test Case | Result | Duration | Details |\n';
        report += '|-----------|--------|----------|----------|\n';

        for (const result of results[model]) {
            const status = result.success ? '✅ Success' : '❌ Failure';
            const details = result.success
                ? 'Output structure valid'
                : `Error: ${formatError(result.error)}`;
            report += `| ${result.name} | ${status} | ${result.duration}ms | ${details} |\n`;
        }

        report += '\n';
    }

    return report;
}


function generateApiResponsesReport(apiResponses) {
    let report = '# AI Function API Responses\n\n';

    for (const model of models) {
        report += `## ${model}\n\n`;

        for (const response of apiResponses[model]) {
            report += `### ${response.name}\n\n`;
            report += `Status: ${response.success ? '✅ Success' : '❌ Failure'}\n\n`;

            if (response.success) {
                report += '#### Response:\n\n';
                report += '```json\n';
                report += JSON.stringify(response.response, null, 2);
                report += '\n```\n\n';
            } else {
                report += '#### Error:\n\n';
                report += '```\n';
                report += formatError(response.error);
                report += '\n```\n\n';
            }
        }

        report += '\n';
    }

    return report;
}

runTests().then(({ results, apiResponses }) => {
    console.log('\nGenerating Markdown reports...');

    const testResultsReport = generateMarkdownReport(results);
    fs.writeFileSync('test_results.md', testResultsReport);
    console.log('Test results report generated: test_results.md');

    const apiResponsesReport = generateApiResponsesReport(apiResponses);
    fs.writeFileSync('api_responses.md', apiResponsesReport);
    console.log('API responses report generated: api_responses.md');
});
