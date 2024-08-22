import { createClient } from '@vercel/edge-config';

const client = createClient(process.env.EDGE_CONFIG);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { wish } = req.body;
    if (!wish) {
      return res.status(400).json({ error: 'Wish is required' });
    }

    try {
      const newWish = { wish, timestamp: Date.now() };
      await client.set('wishes', (currentWishes) => {
        const updatedWishes = Array.isArray(currentWishes) ? [newWish, ...currentWishes] : [newWish];
        return updatedWishes.slice(0, 10); // Keep only the 10 most recent wishes
      });
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
