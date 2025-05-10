const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getItinerary(userInput) {
  const prompt = `
You are a travel expert helping someone plan a trip in Italy.

Here is their request:
"${userInput}"

Based on this input:
- Identify the destination city (or cities)
- Determine how many days they’re staying
- Understand any activity preferences they mention (e.g., museums, food, beaches)

Then, generate a detailed day-by-day travel guide with:
- Specific suggestions for each day
- Real Italian landmarks, food, hidden gems
- Great pacing (not too rushed)
- Unique local experiences
- A vivid, engaging tone (like a personal travel expert)

Format the output with headings like:

Day 1: [Title]  
Morning: ...  
Afternoon: ...  
Evening: ...

Respond in a helpful, human voice.
`;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  return chatCompletion.choices[0].message.content.trim();
}

module.exports = getItinerary;
