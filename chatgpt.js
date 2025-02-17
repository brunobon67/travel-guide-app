require("dotenv").config(); // ✅ Load environment variables

const OpenAI = require("openai"); // ✅ Correct import for OpenAI v4

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getTravelGuide(preferences, stream = false) {
  try {
    console.log("📝 Generating travel guide for:", preferences);

    const prompt = `
    You are an expert travel assistant. Generate a **detailed travel itinerary** based on the following details:
    - **Destination:** ${preferences.destination}
    - **Duration:** ${preferences.duration} days
    - **Accommodation:** ${preferences.accommodation}
    - **Preferred Activities:** ${preferences.preferredActivities}
    - **Nightlife Preferences:** ${preferences.nightlife}

    🎯 **Formatting Rules**:
    - **Use bold headings** for each day (e.g., "**Day 1: Exploring Paris**").
    - Structure the itinerary into **clear sections**:
      - 🌞 **Morning:**  
      - 🌆 **Afternoon:**  
      - 🌙 **Evening:**  
      - 📍 **Must-Visit Places:**  
      - 🍽️ **Food Recommendations:**  
    - Keep responses **detailed and well-structured** with **line breaks between sections**.
    - Use emojis to enhance readability.

    **Example Format:**
    **Day 1: Arrival in Rome**  
    🌞 **Morning:** Visit the Colosseum and Roman Forum.  
    🌆 **Afternoon:** Walk through Piazza Venezia and Trevi Fountain.  
    🌙 **Evening:** Dinner at Trastevere, explore nightlife.  
    📍 **Must-Visit Places:** Colosseum, Trevi Fountain, Vatican City.  
    🍽️ **Food Recommendations:** Try authentic pasta carbonara at Roscioli.  

    Ensure that the response follows the **above structure exactly**.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
