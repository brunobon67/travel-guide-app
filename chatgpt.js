

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const openai = new OpenAIApi(configuration);

async function getItinerary({ destination, duration, activity, notes }) {
  const prompt = `
You are a travel assistant specialized in Italian destinations.

Generate a travel itinerary for a trip to ${destination} in Italy.

- Duration: ${duration} day(s)
- Preferred activity: ${activity}
- Notes: ${notes || "No additional notes"}

The response should be realistic and suitable for a ${duration}-day trip. 
Don't suggest placeholder names or say "undefined". Give real examples of places to visit, eat, and stay. 
Use a friendly tone. 
Format it clearly, day by day.
  `;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }]
  });

  return chatCompletion.choices[0].message.content.trim();
}


module.exports = { getItinerary };
