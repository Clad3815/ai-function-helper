// 10_json_mode_and_validation.js
const { createAiFunctionInstance } = require('ai-function-helper');
const { z } = require('zod');

const aiFunction = createAiFunctionInstance('your_api_key_here');

async function generateProductCatalog() {
  // Define a Zod schema for product validation
  const ProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(3).max(50),
    description: z.string().max(200),
    price: z.number().positive(),
    category: z.enum(['Electronics', 'Clothing', 'Books', 'Home & Garden']),
    inStock: z.boolean()
  });

  const CatalogSchema = z.object({
    products: z.array(ProductSchema).min(3).max(10)
  });

  const options = {
    functionName: 'generate_product_catalog',
    model: 'gpt-4o-mini',
    args: { 
      categoryFocus: "Electronics",
      productCount: 5
    },
    description: 'Generate a product catalog with the specified number of products, focusing on the given category.',
    outputSchema: CatalogSchema
  };

  try {
    const result = await aiFunction(options);
    console.log("Generated Product Catalog:");
    console.log(JSON.stringify(result, null, 2));
    
    // Additional validation (optional, as strictReturn should already ensure this)
    CatalogSchema.parse(result);
    console.log("Catalog successfully validated against the schema.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Schema validation failed:", error.errors);
    } else {
      console.error("Error generating product catalog:", error);
    }
  }
}

generateProductCatalog();

// This example showcases several advanced features:
// 1. Use of Zod for schema definition and validation
// 2. Forcing JSON mode for compatible models
// 3. Strict return type checking
// 
// It generates a product catalog with a specified structure,
// demonstrating how to ensure that the AI's output conforms
// to a precise schema. This is particularly useful for 
// applications that require structured data generation
// or when integrating AI outputs into existing systems
// with strict data format requirements.
