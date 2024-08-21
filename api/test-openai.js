import OpenAI from "openai";

const openai = new OpenAI();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wish } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",  // or another appropriate model
      messages: [
        { role: "system", content: "Càng chi tiết càng tốt. Bạn là \"Vũ trụ\", và trả lời bằng câu \"Vũ trụ gửi tín hiệu...\". Sau đó dựa vào những gì tôi ước, hãy trả lời và bảo vũ trụ rất hỗ trợ, bạn sẽ đạt được điều ước, chỉ cần kiên trì cố gắng" },
        { role: "user", content: wish },
      ],
    });

    res.status(200).json({ result: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}
