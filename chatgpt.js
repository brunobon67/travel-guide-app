require("dotenv").config(); // ✅ Load environment variables

const OpenAI = require("openai"); // ✅ Correct import for OpenAI v4

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getTravelGuide(preferences, stream = false) {
  try {
    console.log("📝 Generating detailed travel guide for:", preferences);

    const prompt = `
    You are an expert travel assistant. Generate a **very detailed travel itinerary** based on the following details:
    - **Destination:** ${preferences.destination}
    - **Duration:** ${preferences.duration} days
    - **Accommodation:** ${preferences.accommodation}
    - **Preferred Activities:** ${preferences.preferredActivities}  
    - **Nightlife Preferences:** ${preferences.nightlife}

    🎯 **Detailed Instructions**:
    - Break the day into **specific time blocks** (e.g., 9:00 AM - 10:00 AM) and provide a clear plan for **every hour**.
    - Include **detailed information** about activities such as sightseeing, meals, relaxation, and transportation.
    - Ensure the schedule is **realistic** and **logistically feasible**.
    - Structure the itinerary with clear **headings for each day** (e.g., "**Day 1: Arrival in Paris**").
    - Include **morning, afternoon, and evening sections**, as well as exact times for:
        - 🌞 **Morning Activities** (e.g., 9:00 AM - Visit the Louvre Museum)
        - 🌆 **Afternoon Activities** (e.g., 1:00 PM - Lunch at Café de Flore)
        - 🌙 **Evening Activities** (e.g., 6:00 PM - Dinner at Le Meurice, 9:00 PM - Seine River Cruise)
        - 📍 **Must-Visit Places** with detailed descriptions of what to see and when
        - 🍽️ **Food Recommendations** with specific restaurant names and meal suggestions at appropriate times
        - 🏨 **Accommodation Details** (e.g., check-in, check-out times)
    - **Add transport suggestions** where applicable (e.g., how to get from one place to another).
    - Keep responses **highly detailed** and **precise**, ensuring the times and locations are aligned logically throughout the day.
    - Ensure that the itinerary is **feasible** and takes into account **location proximity** and **travel time**.

    **Example Format**:

    **Day 1: Arrival in Paris**  
    🌞 **Morning:**  
    - 9:00 AM - Arrive in Paris, check-in at [Hotel Le Meurice](https://www.dorchestercollection.com/en/paris/hotel-le-meurice/)  
    - 10:30 AM - Visit the [Louvre Museum](https://www.louvre.fr/en) (spend about 1.5 hours)  
    🌆 **Afternoon:**  
    - 12:30 PM - Lunch at [Le Jules Verne](https://www.restaurants.paris/en/le-jules-verne) in the Eiffel Tower  
    - 2:00 PM - Walk to [Tuileries Gardens](https://en.parisinfo.com/museum-monument/71347/Jardin-des-Tuileries) (spend about 1 hour)  
    🌙 **Evening:**  
    - 5:00 PM - Explore Montmartre and visit [Sacré-Cœur Basilica](https://www.sacre-coeur-montmartre.com/)  
    - 7:00 PM - Dinner at [Le Meurice Restaurant](https://www.dorchestercollection.com/en/paris/hotel-le-meurice/dining/)  
    - 9:00 PM - Nighttime Seine River Cruise  

    Ensure that the response follows the **above structure exactly**.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",  // ✅ Use GPT-4 model
      messages: [
        { role: "system", content: "You are a travel assistant providing structured, hour-by-hour travel guides." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,  // Increased tokens to support detailed itineraries
      stream: stream  // ✅ Enable streaming for real-time responses
    });

    return response;
  } catch (error) {
    console.error("🚨 OpenAI API error:", error.response ? error.response.data : error.message);
    throw new Error("OpenAI API request failed.");
  }
}

module.exports = getTravelGuide;
