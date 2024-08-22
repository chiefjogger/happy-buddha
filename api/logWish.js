import { createClient } from '@vercel/edge-config';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { wish } = req.body;
    if (!wish) {
      return res.status(400).json({ error: 'Wish is required' });
    }

    try {
      const client = createClient(process.env.EDGE_CONFIG);
      const currentWishes = await client.get('wishes') || [];
      const newWish = { wish, timestamp: Date.now() };
      const updatedWishes = [newWish, ...currentWishes].slice(0, 10);

      await client.set('wishes', updatedWishes);

      res.status(200).json({ message: 'Wish logged successfully' });
    } catch (error) {
      console.error('Error logging wish:', error);
      res.status(500).json({ 
        error: 'Failed to log wish', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
