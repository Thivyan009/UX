import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Function to analyze UI screens for UX issues
export async function analyzeUIScreen(imageUrl: string, screenName: string, screenType: string, description?: string) {
  try {
    // Get the generative model (Gemini Pro Vision for image analysis)
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

    // Prepare the prompt for UX analysis
    const prompt = `
      You are a professional UX auditor. Analyze this ${screenType} UI screen named "${screenName}" 
      ${description ? `with the following context: ${description}` : ""}.
      
      Perform a comprehensive UX audit and identify issues in the following categories:
      1. Accessibility (contrast, text size, alt text, etc.)
      2. Visual Design (consistency, alignment, spacing, etc.)
      3. Usability (navigation, affordance, feedback, etc.)
      4. Information Architecture (hierarchy, grouping, etc.)
      
      For each issue found, provide:
      - A clear title for the issue
      - A detailed description of the problem
      - The severity level (CRITICAL, MODERATE, or MINOR)
      - A specific recommendation to fix the issue
      
      Format your response as a JSON array of issues with the following structure:
      [
        {
          "title": "Issue title",
          "description": "Detailed description of the problem",
          "severity": "CRITICAL|MODERATE|MINOR",
          "recommendation": "Specific recommendation to fix the issue"
        }
      ]
      
      Provide at least 3 issues and at most 8 issues. Focus on the most important UX problems.
    `

    // For a real implementation, we would fetch the image and convert it to base64
    // For now, we'll use a placeholder image for demonstration
    // In a production app, you would fetch the actual image from your storage

    // Create a parts array with the prompt and image
    const imageParts = await getImageParts(imageUrl)

    const result = await model.generateContent([prompt, ...imageParts])
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }

      const jsonStr = jsonMatch[0]
      const issues = JSON.parse(jsonStr)

      return {
        success: true,
        issues,
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      return {
        success: false,
        error: "Failed to parse analysis results",
        rawResponse: text,
      }
    }
  } catch (error) {
    console.error("Gemini API error:", error)
    return {
      success: false,
      error: "Failed to analyze UI screen",
    }
  }
}

// Helper function to get image parts for the Gemini API
async function getImageParts(imageUrl: string) {
  // In a real implementation, you would fetch the image and convert it to base64
  // For now, we'll use a placeholder approach

  // If the imageUrl is a remote URL, fetch it
  if (imageUrl.startsWith("http")) {
    try {
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")

      return [
        {
          inlineData: {
            data: base64,
            mimeType: response.headers.get("content-type") || "image/jpeg",
          },
        },
      ]
    } catch (error) {
      console.error("Error fetching image:", error)
      throw new Error("Failed to fetch image for analysis")
    }
  } else {
    // For local paths or placeholders, we'll use a default approach
    // In a real app, you would handle this differently
    return [
      {
        inlineData: {
          // This is a tiny transparent pixel as a fallback
          data: "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
          mimeType: "image/gif",
        },
      },
    ]
  }
}
