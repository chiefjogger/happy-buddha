import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('wishes_db');
  const wishesCollection = db.collection('wishes');
  cachedClient = { client, db };
  return cachedClient;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wish } = req.body;

  if (!wish) {
    return res.status(400).json({ error: 'Wish is required' });
  }

  try {
    const { db } = await connectToDatabase();
    const wishesCollection = db.collection('wishes');

    const newWish = { wish, timestamp: new Date() };
    await wishesCollection.insertOne(newWish);

    res.status(200).json({ message: 'Wish logged successfully' });
  } catch (error) {
    console.error('Error logging wish:', error);
    res.status(500).json({ error: 'Failed to log wish' });
  }
}

export async function getWishes(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const wishesCollection = db.collection('wishes');

    const wishes = await wishesCollection.find().sort({ timestamp: -1 }).limit(100).toArray();
    res.status(200).json(wishes);
  } catch (error) {
    console.error('Error fetching wishes:', error);
    res.status(500).json({ error: 'Failed to fetch wishes' });
  }
}
