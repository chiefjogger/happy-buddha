import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Say something wise about Buddha in one sentence:",
      max_tokens: 50
    });

    res.status(200).json({ result: completion.data.choices[0].text.trim() });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}
