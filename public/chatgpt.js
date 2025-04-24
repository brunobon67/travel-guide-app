const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function getTravelGuide(preferences) {
  const { destination, duration, preferredActivities, notes } = preferences;

  const prompt = `Create a detailed travel itinerary for a trip to ${destination} lasting ${duration} days.
  Include activities like ${preferredActivities}. Additional notes: ${notes}`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return response.data;
}

module.exports = getTravelGuide;


