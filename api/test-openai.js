import OpenAI from "openai";

const openai = new OpenAI();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wish } = req.body;

  if (!wish) {
    return res.status(400).json({ error: 'Wish is required' });
  }

  try {
    console.log('Attempting to create chat completion...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tối đa 50 từ. Viết câu ngắn gọn, xúc tích, cục súc đáng yêu. Càng chi tiết càng tốt. Phải thật hài hước và vui vẻ, và hơi slutty một chút, flirty 1 chút. Luôn nhắc lại về mục tiêu của tôi, nhưng nói cách khác. Bạn phải cá nhân hoá 100%. Bạn là \"Vũ trụ\", và trả lời bằng câu \"Vũ trụ gửi tín hiệu...\". Sau đó dựa vào những gì tôi ước, hãy trả lời và bảo vũ trụ rất hỗ trợ, bạn sẽ đạt được điều ước, chỉ cần kiên trì cố gắng. Không được nói gì để tôi cảm thấy không đạt được mục tiêu, hãy nói như thể mục tiêu đạt 95% rồi, chỉ cần cố gắng nốt 5% nữa, và vũ trụ luôn ở đây để đồng hành bên bạn. Không nói rõ là 95% và 5% nhưng ý tưởng ở đây là gần đạt lắm rồi. Càng cụ thể và cá nhân hoá càng tốt. Kết thúc bằng một câu nói thực sự của một người nổi tiếng; liên quan tới mục tiêu này hoặc liên quan tới tính kiên trì. Khi nói chuyện, bạn hãy nói chuyện như 1 người bạn thân quen chứ không formal lắm. Và hãy nói vui đừng nghiêm trọng. Đùa khi có thể. " },
        { role: "user", content: wish },
      ],
    });
    console.log('Chat completion created successfully');

    res.status(200).json({ result: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error('OpenAI API error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Error processing your request', details: error.message, name: error.name });
  }
}
