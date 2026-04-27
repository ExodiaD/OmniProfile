import { config } from 'dotenv';
config({ path: '.env.local' });

async function test() {
  const tag = '%23PQ9CUG0V0'; // #PQ9CUG0V0 URL encoded
  const apiKey = process.env.BRAWLSTARS_API_KEY;
  const res = await fetch(`https://api.brawlstars.com/v1/players/${tag}`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
