const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getItinerary(userInput) {
  const prompt = `
You are a travel assistant specialized in Italy.

Generate a detailed travel itinerary based on the user's request below:

"${userInput}"

Guidelines:
- Be accurate and respond based strictly on what the user asked
- If they specify a duration (e.g. 3 days), provide a plan for that exact number of days
- Use real cities, landmarks, activities, and local experiences
- Format the output clearly with titles like "Day 1", "Day 2", etc.
- Avoid generic phrases or placeholders like "undefined"
- Make the itinerary vivid, engaging, and useful for the user

Begin:
`;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  return chatCompletion.choices[0].message.content.trim();
}

module.exports = { getItinerary };
