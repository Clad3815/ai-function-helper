// 9_image_input.js
const { createAiFunctionInstance } = require('ai-function-helper');

const aiFunction = createAiFunctionInstance('your_api_key_here');

async function analyzeImage() {
  const options = {
    functionName: 'analyze_image',
    model: 'gpt-4o-mini', // Make sure to use a vision-capable model
    args: { 
      imageDescription: "Analyze the contents of this image."
    },
    description: 'Analyze the given image and provide a detailed description of its contents.',
    outputSchema: {
      type: "object",
      properties: {
        description: { type: "string" },
        mainElements: { type: "array", items: { type: "string" } },
        dominantColors: { type: "array", items: { type: "string" } }
      },
      required: ["description", "mainElements", "dominantColors"]
    },
    imagePrompt: 'https://example.com/path/to/your/image.jpg', // Replace with your image URL
    imageQuality: 'high'
  };

  try {
    const result = await aiFunction(options);
    console.log("Image Analysis:");
    console.log("Description:", result.description);
    console.log("Main Elements:", result.mainElements.join(", "));
    console.log("Dominant Colors:", result.dominantColors.join(", "));
  } catch (error) {
    console.error("Error analyzing image:", error);
  }
}

analyzeImage();

// This example demonstrates how to use image inputs with AI Function Helper.
// It uses a vision-capable model to analyze an image and provide a 
// structured description of its contents. This feature is particularly 
// useful for tasks like content moderation, visual question answering,
// or any application that requires understanding of visual data.
// Note: Ensure you're using a model that supports image inputs, like GPT-4 with vision.
