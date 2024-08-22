import { get } from '@vercel/edge-config';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const wishes = await get('wishes');
      if (!wishes) {
        return res.status(200).json([]);  // Return empty array if no wishes found
      }
      res.status(200).json(wishes);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve wishes', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
