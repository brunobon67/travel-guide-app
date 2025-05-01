const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getItinerary({ destination, duration, activity, notes }) {
  const prompt = `
You are a travel assistant specialized in Italian tourism.

Generate a detailed and well-formatted ${duration}-day travel itinerary for a trip in the Italian region of ${destination}.

The user has indicated the following travel interests and preferences:
- ${activity}

Guidelines:
- Tailor the itinerary for exactly ${duration} day(s)
- Mention real cities, villages, landmarks, museums, and local dishes
- Avoid using placeholders like "undefined"
- Structure the response clearly with headings for each day

Example format:
Day 1: ...
Day 2: ...
(continue until day ${duration})

Be precise, engaging, and avoid repetition.
`;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  return chatCompletion.choices[0].message.content.trim();
}

module.exports = { getItinerary };
