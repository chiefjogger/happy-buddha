import { createClient } from '@vercel/edge-config';

export default async function handler(req, res) {
  try {
    const client = createClient(process.env.EDGE_CONFIG);
    const wishes = await client.get('wishes') || [];
    res.status(200).json(wishes);
  } catch (error) {
    console.error('Error fetching wishes:', error);
    res.status(500).json({ error: 'Failed to fetch wishes' });
  }
}
