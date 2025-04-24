const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function getTravelGuide(preferences) {
  const prompt = `
Generate a detailed travel itinerary for a trip to ${preferences.destination} in Italy.
Duration: ${preferences.duration} days.
Preferred activities: ${preferences.preferredActivities}.
Other preferences: ${preferences.nightlife}.
Make it informative, engaging, and structured by days.
`;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return completion.data;
}

module.exports = getTravelGuide;
