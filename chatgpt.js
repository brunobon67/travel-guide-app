const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getItinerary(userInput) {
  const messages = [
    {
      role: "system",
      content: `
You are a professional Italian travel guide planner.

When a user tells you where they want to go and for how long, analyze their message to:
- Extract city/cities mentioned
- Extract number of days
- Note special preferences (family, beaches, food, etc.)

Then generate a personalized, detailed itinerary with the following format:
"Day 1: [Title]  
Morning: ...  
Afternoon: ...  
Evening: ..."

Focus only on the cities and number of days they mention. If they say "3 days in Rome, then Amalfi Coast", don't invent other locations.

Be specific, helpful, and engaging. Recommend real sights, food spots, hidden gems, and local tips.
`
    },
    {
      role: "user",
      content: userInput
    }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return response.choices[0].message.content.trim();
}

module.exports = getItinerary;
