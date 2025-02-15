const { OpenAI } = require("openai"); // ✅ Correct import for OpenAI v4

// ✅ Use process.env directly (GitHub Secrets are exposed as environment variables)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // 🔹 Ensure this variable is set in GitHub Secrets
});

async function getTravelGuide(preferences) {
  try {
    console.log("📝 Generating travel guide for:", preferences);

    const prompt = `
    You are a travel expert. Create a detailed itinerary for a trip based on the following details:
    - Destination: ${preferences.destination}
    - Duration: ${preferences.duration} days
    - Accommodation: ${preferences.accommodation}
    - Preferred Activities: ${preferences.preferredActivities}
    - Nightlife Preferences: ${preferences.nightlife}

    🎯 **Format Requirements**:
    - Use **bold titles** for each day (e.g., "**Day 1**").
    - Provide detailed activities per day, including morning, afternoon, and evening plans.
    - Mention **must-visit places**, hidden gems, and great local restaurants.
    - Suggest **nearby cities** or day trips from ${preferences.destination}.

    Please return the guide in a well-structured format.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a travel assistant providing detailed travel itineraries." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    return response.choices[0]?.message?.content.trim() || "No guide available.";
  } catch (error) {
    console.error("🚨 OpenAI API error:", error.response ? error.response.data : error.message);
    throw new Error("OpenAI API request failed.");
  }
}

module.exports = getTravelGuide;
