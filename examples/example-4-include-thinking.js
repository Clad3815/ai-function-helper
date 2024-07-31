// 4_include_thinking.js
const { createAiFunctionInstance } = require('ai-function-helper');

const aiFunction = createAiFunctionInstance('your_api_key_here');

async function solveComplexProblem() {
  const options = {
    functionName: 'solve_problem',
    model: 'gpt-4o',
    args: { 
      problem: "A train travels 120 km at a speed of 40 km/h. It then increases its speed to 60 km/h for the next 90 km. What is the average speed for the entire journey?"
    },
    description: 'Solve the given mathematical problem, showing all steps.',
    outputSchema: {
      type: "object",
      properties: {
        steps: { type: "array", items: { type: "string" } },
        finalAnswer: { type: "number" }
      },
      required: ["steps", "finalAnswer"]
    },
    includeThinking: true,
    showDebug: true
  };

  try {
    const result = await aiFunction(options);
    console.log("Problem Solution:");
    result.steps.forEach((step, index) => {
      console.log(`Step ${index + 1}: ${step}`);
    });
    console.log(`Final Answer: ${result.finalAnswer} km/h`);
  } catch (error) {
    console.error("Error solving problem:", error);
  }
}

solveComplexProblem();

// This example showcases the 'includeThinking' feature.
// It solves a complex mathematical problem, showing the AI's thought process
// in the debug output. This is useful for understanding how the AI arrives
// at its conclusions and for debugging complex reasoning tasks.
// Note: Make sure to check the console for the detailed thinking process.
