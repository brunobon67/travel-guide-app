async function getItinerary(userInput) {
  const messages = [
    {
      role: "system",
      content: `
You are a professional Italian travel guide planner...

(be sure your full system prompt is here)
`
    },
    {
      role: "user",
      content: userInput
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    return response.choices[0].message.content.trim();

  } catch (err) {
    console.error("OpenAI Error:", err.response?.data || err.message || err);
    throw err;
  }
}
