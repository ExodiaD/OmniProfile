import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCache, setCache } from '@/lib/redis';

// Mock schema to validate the "external API" response
const GithubUserSchema = z.object({
  login: z.string(),
  avatar_url: z.string().url(),
  public_repos: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string(),
}).passthrough();

type GithubUser = z.infer<typeof GithubUserSchema>;

// Rate limiting state (in-memory for simple rate limiting per IP in a real app, here just a global mock)
let requestCount = 0;
let lastReset = Date.now();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Rate Limiting Logic (mocking 5 requests per 30 seconds for the API)
  const now = Date.now();
  if (now - lastReset > 30000) {
    requestCount = 0;
    lastReset = now;
  }
  
  if (requestCount >= 5) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.' },
      { status: 429, headers: { 'Retry-After': '30' } }
    );
  }

  requestCount++;

  const cacheKey = `github:user:${username}`;

  // 1. Check Cache
  const cachedData = await getCache<GithubUser>(cacheKey);
  if (cachedData) {
    // Return transformed cached data
    return NextResponse.json({
      data: cachedData,
      source: 'cache'
    });
  }

  // 2. Fetch from External API
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'Omni-Profile',
      },
    });

    if (res.status === 404) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!res.ok) {
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const rawData = await res.json();

    // 3. Validate with Zod
    const validatedData = GithubUserSchema.parse(rawData);

    // 4. Transform data (adding a mock engagement score)
    const accountAgeYears = (Date.now() - new Date(validatedData.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);
    const transformedData = {
      ...validatedData,
      engagement_score: Math.round((validatedData.followers / (validatedData.public_repos || 1)) * accountAgeYears),
    };

    // 5. Save to Cache (15 minutes TTL)
    await setCache(cacheKey, transformedData, 900);

    return NextResponse.json({
      data: transformedData,
      source: 'api'
    });
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data format from provider', details: error.flatten() }, { status: 502 });
    }
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
