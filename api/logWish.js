import { createEdgeConfigClient } from '@vercel/edge-config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wish } = req.body;

  if (!wish) {
    return res.status(400).json({ error: 'Wish is required' });
  }

  try {
    console.log('Attempting to update Edge Config');
    console.log('Edge Config ID:', process.env.EDGE_CONFIG_ID);

    const edgeConfig = createEdgeConfigClient(process.env.EDGE_CONFIG);

    // Get current wishes
    let wishes = await edgeConfig.get('wishes') || [];
    console.log('Current wishes:', wishes);

    // Add new wish
    wishes.push(wish);
    console.log('Updated wishes:', wishes);

    // Update wishes in Edge Config
    await edgeConfig.set('wishes', wishes);

    console.log('Wish logged successfully');
    res.status(200).json({ message: 'Wish logged successfully' });
  } catch (error) {
    console.error('Error logging wish:', error);
    res.status(500).json({ 
      error: 'Failed to log wish', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
