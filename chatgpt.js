require("dotenv").config(); // ✅ Load environment variables

const OpenAI = require("openai"); // ✅ Correct import for OpenAI v4

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getTravelGuide(preferences, stream = false) {
  try {
    console.log("📝 Generating travel guide for:", preferences);

    const prompt = `
    You are a travel assistant. Create a **detailed itinerary** for:
    - Destination: ${preferences.destination}
    - Duration: ${preferences.duration} days
    - Accommodation: ${preferences.accommodation}
    - Activities: ${preferences.preferredActivities}
    - Nightlife: ${preferences.nightlife}

    🎯 **Format Requirements**:
    - **Bold Day Titles** (e.g., "**Day 1: Arrival in Rome**").
    - List activities per day, divided into:
      - 🌞 **Morning:** 
      - 🌆 **Afternoon:** 
      - 🌙 **Evening:** 
    - Include 📍 **Must-Visit Places**, 🍽️ **Food Recommendations**, and 🌟 **Hidden Gems**.
    - If applicable, suggest a **day trip** from ${preferences.destination}.

    Keep responses **detailed and well-structured**.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 🚀 Faster & Cheaper than GPT-4
      messages: [
        { role: "system", content: "You are a travel assistant providing structured travel guides." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200,  // ✅ Keeping full detail while optimizing speed
      stream: stream  // ✅ Enable streaming for real-time responses
    });

    return response;
  } catch (error) {
    console.error("🚨 OpenAI API error:", error.response ? error.response.data : error.message);
    throw new Error("OpenAI API request failed.");
  }
}

module.exports = getTravelGuide;

