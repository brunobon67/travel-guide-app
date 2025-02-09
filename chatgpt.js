require("dotenv").config(); // ✅ Load environment variables

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.MY_GITHUB_SECRET,
});

async function getTravelGuide(preferences) {
  try {
    const prompt = `
    Plan a detailed travel itinerary for:
    - Destination: ${preferences.destination}
    - Duration: ${preferences.duration} days
    - Budget: ${preferences.budget}
    - Accommodation: ${preferences.accommodation}
    - Preferred Activities: ${preferences.preferredActivities}
    - Nightlife: ${preferences.nightlife}
    
    Include daily schedules, recommended hotels, restaurants, and must-do activities.
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
    console.error("🚨 OpenAI API error:", error);
    throw new Error("OpenAI API request failed.");
  }
}

module.exports = getTravelGuide;

