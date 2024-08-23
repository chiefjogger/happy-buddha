import fs from 'fs';
import path from 'path';

const wishesPath = path.join(process.cwd(), 'data', 'wishes.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wish } = req.body;

  if (!wish) {
    return res.status(400).json({ error: 'Wish is required' });
  }

  try {
    let wishes = [];
    if (fs.existsSync(wishesPath)) {
      const data = fs.readFileSync(wishesPath, 'utf8');
      wishes = JSON.parse(data);
    }

    wishes.push({ wish, timestamp: new Date().toISOString() });
    fs.writeFileSync(wishesPath, JSON.stringify(wishes, null, 2));

    res.status(200).json({ message: 'Wish logged successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log wish' });
  }
}
