import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say something wise about Buddha in one sentence:" },
      ],
      max_tokens: 50
    });

    res.status(200).json({ result: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}
