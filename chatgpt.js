require("dotenv").config(); // ✅ Load environment variables

const { OpenAI } = require("openai"); // ✅ Correct import for OpenAI v4

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getTravelGuide(preferences) {
  try {
    console.log("📝 Generating travel guide for:", preferences);

    const prompt = `
You are a travel expert. Create a **detailed, structured, and easy-to-read** itinerary for a trip based on the following details:

📍 **Destination:** ${preferences.destination}  
📆 **Duration:** ${preferences.duration} days  
🏨 **Accommodation Type:** ${preferences.accommodation}  
🎯 **Preferred Activities:** ${preferences.preferredActivities}  
🌙 **Nightlife Preferences:** ${preferences.nightlife}  

### 🎯 **Format Requirements:**
1️⃣ **Each day must start with "Day X"** (e.g., "Day 1: Exploring Verona").  
2️⃣ For each day, provide:
   - 🌞 **Morning:** Activities to start the day.
   - 🌆 **Afternoon:** Recommended places and experiences.
   - 🌙 **Evening:** Night activities or relaxation options.
   - 📍 **Must-visit:** Highlight **2-3 important places**.
   - 🍽️ **Local Food:** Suggested dishes & restaurants.
   - 🛀 **Relaxation:** Best spots to unwind (if applicable).
   - 🎶 **Nightlife:** Bars, clubs, or quiet spots for a chill evening.

### 📝 **Style Guidelines:**
- **Use bullet points** for activities to make the plan **easy to read**.
- **Keep descriptions short & engaging** (1-2 sentences per activity).
- **Include emoji icons** to visually organize the itinerary.
- **Ensure consistent formatting** so it can be processed by a frontend script.

🚀 Make the itinerary **fun, informative, and well-structured**!
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a travel assistant providing structured, engaging travel itineraries." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    // ✅ Safe Response Handling (no optional chaining)
    if (response.choices && response.choices[0] && response.choices[0].message) {
      return response.choices[0].message.content.trim();
    } else {
      return "No guide available.";
    }

  } catch (error) {
    console.error("🚨 OpenAI API error:", error.response ? error.response.data : error.message);
    throw new Error("OpenAI API request failed.");
  }
}

module.exports = getTravelGuide;
