export default async function handler(req, res) {
  const { key } = req.query; // Get the key from the query parameter

  if (req.method === 'GET') {
    try {
      const value = await get(key);
      res.status(200).json({
        key: key,
        value: value,
        type: typeof value,
        isArray: Array.isArray(value),
        length: Array.isArray(value) ? value.length : 'N/A'
      });
    } catch (error) {
      console.error(`Error fetching Edge Config data for key '${key}':`, error);
      res.status(500).json({ 
        error: `Failed to fetch Edge Config data for key '${key}'`, 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
