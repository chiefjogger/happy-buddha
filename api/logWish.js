import { get, set } from '@vercel/edge-config';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { wish } = req.body;
    try {
      const wishes = await get('wishes') || [];
      wishes.unshift({ wish, timestamp: Date.now() });
      if (wishes.length > 10) wishes.pop(); // Keep only the 10 most recent wishes
      await set('wishes', wishes);
      res.status(200).json({ message: 'Wish logged successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log wish' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

catch (error) {
  console.error('Error details:', error);
  res.status(500).json({ error: 'Failed to retrieve wishes', details: error.message });
}
