const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getItinerary({ destination, duration, activity, notes }) {
  const prompt = `
You are a travel assistant specialized in Italian destinations.

Generate a travel itinerary for a trip to ${destination} in Italy.

- Duration: ${duration} day(s)
- Preferred activity: ${activity}
- Notes: ${notes || "No additional notes"}

Make sure the itinerary is actually suitable for a ${duration}-day trip. Be specific. 
Avoid generic or undefined words. Use proper names of places, food, etc.

Format:
Day 1: ...
Day 2: ...
(etc. depending on duration)
`;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  return chatCompletion.choices[0].message.content.trim();
}

module.exports = { getItinerary };
