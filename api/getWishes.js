import { get } from '@vercel/edge-config';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const wishes = await get('wishes') || [];
      res.status(200).json(wishes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve wishes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

catch (error) {
  console.error('Error details:', error);
  res.status(500).json({ error: 'Failed to retrieve wishes', details: error.message });
}

