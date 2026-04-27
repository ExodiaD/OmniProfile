import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCache, setCache } from '@/lib/redis';

const SupercellPlayerSchema = z.object({
  tag: z.string(),
  name: z.string(),
  expLevel: z.number(),
  trophies: z.number(),
  bestTrophies: z.number(),
  wins: z.number(),
  losses: z.number(),
  battleCount: z.number(),
  threeCrownWins: z.number().optional().default(0),
  challengeCardsWon: z.number().optional().default(0),
  challengeMaxWins: z.number().optional().default(0),
  tournamentCardsWon: z.number().optional().default(0),
  tournamentBattleCount: z.number().optional().default(0),
  donations: z.number().optional().default(0),
  donationsReceived: z.number().optional().default(0),
  totalDonations: z.number().optional().default(0),
  warDayWins: z.number().optional().default(0),
  clanCardsCollected: z.number().optional().default(0),
  starPoints: z.number().optional().default(0),
  expPoints: z.number().optional().default(0),
  totalExpPoints: z.number().optional().default(0),
  role: z.string().optional().nullable(),
  clan: z.object({
    tag: z.string().optional(),
    name: z.string(),
    badgeId: z.number().optional(),
  }).optional().nullable(),
  currentFavouriteCard: z.object({
    name: z.string(),
    id: z.number().optional(),
    maxLevel: z.number().optional(),
    elixirCost: z.number().optional(),
    rarity: z.string().optional(),
    iconUrls: z.object({ medium: z.string().optional() }).optional(),
  }).optional().nullable(),
  // Legacy field
  favoriteCard: z.object({ name: z.string() }).optional().nullable(),
  cards: z.array(z.any()).optional().default([]),
  currentDeck: z.array(z.any()).optional().default([]),
  supportCards: z.array(z.any()).optional().default([]),
  currentDeckSupportCards: z.array(z.any()).optional().default([]),
  badges: z.array(z.object({
    name: z.string(),
    level: z.number().optional(),
    maxLevel: z.number().optional(),
    progress: z.number().optional(),
    target: z.number().optional(),
    iconUrls: z.object({ large: z.string().optional() }).optional(),
  })).optional().default([]),
  achievements: z.array(z.object({
    name: z.string(),
    stars: z.number().optional(),
    value: z.number().optional(),
    target: z.number().optional(),
    info: z.string().optional(),
  })).optional().default([]),
  arena: z.object({
    id: z.number().optional(),
    name: z.string(),
  }).optional(),
  currentPathOfLegendSeasonResult: z.object({
    leagueNumber: z.number().optional(),
    trophies: z.number().optional(),
    rank: z.any().optional(),
  }).optional().nullable(),
  bestPathOfLegendSeasonResult: z.object({
    leagueNumber: z.number().optional(),
    trophies: z.number().optional(),
    rank: z.any().optional(),
  }).optional().nullable(),
  progress: z.any().optional().nullable(),
}).passthrough();

type SupercellPlayer = z.infer<typeof SupercellPlayerSchema>;

// Rate limiting state
let requestCount = 0;
let lastReset = Date.now();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  if (!tag) {
    return NextResponse.json({ error: 'Player tag is required' }, { status: 400 });
  }

  const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
  const urlSafeTag = encodeURIComponent(formattedTag);

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

  const cacheKey = `supercell:v3:player:${formattedTag}`;

  // 1. Check Cache
  const cachedData = await getCache<any>(cacheKey);
  if (cachedData) {
    return NextResponse.json({
      data: cachedData,
      source: 'cache'
    });
  }

  // 2. Fetch from External API or Mock
  try {
    const apiKey = process.env.SUPERCELL_API_KEY;
    let rawData;

    if (!apiKey) {
      console.warn("SUPERCELL_API_KEY is not set. Using mock data.");
      await new Promise(resolve => setTimeout(resolve, 800));
      const seed = formattedTag.length;
      
      rawData = {
        tag: formattedTag,
        name: `Player_${formattedTag.replace('#', '')}`,
        expLevel: 10 + (seed % 40),
        trophies: 4000 + (seed * 100),
        bestTrophies: 4500 + (seed * 150),
        wins: 1500 + (seed * 50),
        losses: 1400 + (seed * 45),
        battleCount: 3000 + (seed * 100),
        threeCrownWins: 400 + seed * 10,
        challengeCardsWon: 20 + seed,
        challengeMaxWins: 5,
        tournamentCardsWon: 0,
        tournamentBattleCount: 10,
        donations: 500 + seed * 10,
        donationsReceived: 200 + seed * 5,
        totalDonations: 1000 + seed * 20,
        warDayWins: 15,
        clanCardsCollected: 500,
        starPoints: 10000,
        expPoints: 5000,
        totalExpPoints: 250000,
        role: 'elder',
        clan: { tag: '#GGLJYUQ0', name: 'Royale Kings', badgeId: 16000000 },
        currentFavouriteCard: { name: 'Knight', id: 26000000, maxLevel: 16, elixirCost: 3, rarity: 'common', iconUrls: {} },
        cards: [],
        currentDeck: [],
        supportCards: [],
        currentDeckSupportCards: [],
        badges: [],
        achievements: [],
        arena: { id: 54000031, name: 'Legendary Arena' },
        currentPathOfLegendSeasonResult: { leagueNumber: 1, trophies: 0, rank: null },
        bestPathOfLegendSeasonResult: { leagueNumber: 1, trophies: 0, rank: null },
      };
    } else {
      const res = await fetch(`https://api.clashroyale.com/v1/players/${urlSafeTag}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      });

      if (res.status === 404) {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      }

      if (!res.ok) {
        throw new Error(`Supercell API responded with ${res.status}`);
      }

      rawData = await res.json();
    }

    // 3. Validate with Zod
    const validatedData = SupercellPlayerSchema.parse(rawData);

    // 4. Transform data
    const winRate = ((validatedData.wins / (validatedData.wins + validatedData.losses || 1)) * 100).toFixed(1);
    
    // Compute card stats
    const maxedCards = validatedData.cards.filter((c: any) => c.level === c.maxLevel).length;
    const avgCardLevel = validatedData.cards.length > 0
      ? (validatedData.cards.reduce((sum: number, c: any) => sum + (16 - ((c.maxLevel || 16) - (c.level || 1))), 0) / validatedData.cards.length).toFixed(1)
      : '0';

    const transformedData = {
      ...validatedData,
      // Use currentFavouriteCard if available, fallback to favoriteCard
      favoriteCard: validatedData.currentFavouriteCard || validatedData.favoriteCard || null,
      winRate: parseFloat(winRate),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${formattedTag}`,
      cardStats: {
        total: validatedData.cards.length,
        maxed: maxedCards,
        avgLevel: parseFloat(avgCardLevel),
      },
    };

    // 5. Save to Cache (15 minutes TTL)
    await setCache(cacheKey, transformedData, 900);

    return NextResponse.json({
      data: transformedData,
      source: apiKey ? 'api' : 'mock-api'
    });
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data format from provider', details: error.flatten() }, { status: 502 });
    }
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
