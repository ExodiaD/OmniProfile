import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCache, setCache } from '@/lib/redis';

const BrawlStarsPlayerSchema = z.object({
  tag: z.string(),
  name: z.string(),
  nameColor: z.string().optional().nullable(),
  trophies: z.number(),
  highestTrophies: z.number(),
  totalPrestigeLevel: z.number().optional().default(0),
  expLevel: z.number(),
  expPoints: z.number().optional().default(0),
  isQualifiedFromChampionshipChallenge: z.boolean().optional().default(false),
  '3vs3Victories': z.number().optional().default(0),
  soloVictories: z.number().optional().default(0),
  duoVictories: z.number().optional().default(0),
  bestRoboRumbleTime: z.number().optional().default(0),
  bestTimeAsBigBrawler: z.number().optional().default(0),
  // Ranked data
  rankedSeasonId: z.number().optional().nullable(),
  rankedRank: z.number().optional().default(0),
  rankedRankName: z.string().optional().nullable(),
  rankedElo: z.number().optional().default(0),
  highestSeasonRankedRank: z.number().optional().default(0),
  highestSeasonRankedRankName: z.string().optional().nullable(),
  highestSeasonRankedElo: z.number().optional().default(0),
  highestAllTimeRankedRank: z.number().optional().default(0),
  highestAllTimeRankedRankName: z.string().optional().nullable(),
  highestAllTimeRankedElo: z.number().optional().default(0),
  // Club
  club: z.object({
    tag: z.string().optional(),
    name: z.string(),
  }).optional().nullable(),
  // Brawlers (full detail)
  brawlers: z.array(z.object({
    id: z.number(),
    name: z.string(),
    power: z.number().optional().default(1),
    rank: z.number().optional().default(0),
    trophies: z.number().optional().default(0),
    highestTrophies: z.number().optional().default(0),
    prestigeLevel: z.number().optional().default(0),
    currentWinStreak: z.number().optional().default(0),
    maxWinStreak: z.number().optional().default(0),
    skin: z.object({ id: z.number(), name: z.string() }).optional().nullable(),
    gadgets: z.array(z.object({ id: z.number(), name: z.string() })).optional().default([]),
    starPowers: z.array(z.object({ id: z.number(), name: z.string() })).optional().default([]),
    gears: z.array(z.object({ id: z.number(), name: z.string(), level: z.number().optional() })).optional().default([]),
    hyperCharges: z.array(z.object({ id: z.number(), name: z.string() })).optional().default([]),
  })).optional().default([]),
  icon: z.object({
    id: z.number(),
  }).optional().nullable(),
}).passthrough();

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
  const cacheKey = `brawlstars:v4:player:${formattedTag}`;

  const cachedData = await getCache<any>(cacheKey);
  if (cachedData) {
    return NextResponse.json({
      data: cachedData,
      source: 'cache'
    });
  }

  try {
    const apiKey = process.env.BRAWLSTARS_API_KEY;
    let rawData;

    if (!apiKey) {
      console.warn("BRAWLSTARS_API_KEY is not set. Using mock data.");
      await new Promise(resolve => setTimeout(resolve, 800));
      const seed = formattedTag.length;
      
      rawData = {
        tag: formattedTag,
        name: `Brawler_${formattedTag.replace('#', '')}`,
        nameColor: '0xffffffff',
        trophies: 15000 + (seed * 100),
        highestTrophies: 16000 + (seed * 150),
        totalPrestigeLevel: 10,
        expLevel: 50 + seed,
        expPoints: 50000 + seed * 1000,
        isQualifiedFromChampionshipChallenge: false,
        '3vs3Victories': 3000 + (seed * 50),
        soloVictories: 500 + seed,
        duoVictories: 400 + seed,
        bestRoboRumbleTime: 11,
        bestTimeAsBigBrawler: 0,
        rankedSeasonId: 40,
        rankedRank: 10,
        rankedRankName: 'DIAMOND I',
        rankedElo: 3100,
        highestSeasonRankedRank: 10,
        highestSeasonRankedRankName: 'DIAMOND I',
        highestSeasonRankedElo: 3100,
        highestAllTimeRankedRank: 19,
        highestAllTimeRankedRankName: 'MASTERS I',
        highestAllTimeRankedElo: 9000,
        brawlers: [
          { id: 16000000, name: 'SHELLY', power: 11, rank: 5, trophies: 1100, highestTrophies: 1145, prestigeLevel: 1, currentWinStreak: 0, maxWinStreak: 4, skin: null, gadgets: [{id: 1, name: 'FAST FORWARD'}], starPowers: [{id: 1, name: 'SHELL SHOCK'}], gears: [{id: 1, name: 'DAMAGE', level: 3}], hyperCharges: [{id: 1, name: 'DOUBLE BARREL'}] },
          { id: 16000001, name: 'COLT', power: 11, rank: 4, trophies: 900, highestTrophies: 950, prestigeLevel: 0, currentWinStreak: 3, maxWinStreak: 12, skin: null, gadgets: [{id: 2, name: 'SPEEDLOADER'}], starPowers: [{id: 2, name: 'SLICK BOOTS'}], gears: [{id: 1, name: 'DAMAGE', level: 3}], hyperCharges: [] },
        ],
        club: { tag: '#2CRG', name: 'Star Club' },
        icon: { id: 28000032 },
      };
    } else {
      const res = await fetch(`https://api.brawlstars.com/v1/players/${urlSafeTag}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      });

      if (res.status === 404) {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      }

      if (!res.ok) {
        throw new Error(`Brawl Stars API responded with ${res.status}`);
      }

      rawData = await res.json();
    }

    const validatedData = BrawlStarsPlayerSchema.parse(rawData);

    // Calculate total victories
    const totalVictories = validatedData['3vs3Victories'] + validatedData.soloVictories + validatedData.duoVictories;
    
    const avatarUrl = validatedData.icon?.id 
      ? `https://cdn.brawlify.com/profile-icons/regular/${validatedData.icon.id}.png`
      : `https://api.dicebear.com/7.x/bottts/svg?seed=${formattedTag}brawl`;

    // Compute stats
    const maxPowerBrawlers = validatedData.brawlers.filter(b => b.power >= 11).length;
    const maxRankBrawlers = validatedData.brawlers.filter(b => b.rank >= 5).length;
    const totalGadgets = validatedData.brawlers.reduce((a, b) => a + b.gadgets.length, 0);
    const totalStarPowers = validatedData.brawlers.reduce((a, b) => a + b.starPowers.length, 0);
    const totalGears = validatedData.brawlers.reduce((a, b) => a + b.gears.length, 0);
    const totalHyperCharges = validatedData.brawlers.reduce((a, b) => a + b.hyperCharges.length, 0);
    const avgBrawlerTrophies = validatedData.brawlers.length > 0
      ? Math.round(validatedData.brawlers.reduce((a, b) => a + b.trophies, 0) / validatedData.brawlers.length)
      : 0;

    const transformedData = {
      ...validatedData,
      totalVictories,
      avatarUrl, 
      stats: {
        maxPowerBrawlers,
        maxRankBrawlers,
        totalGadgets,
        totalStarPowers,
        totalGears,
        totalHyperCharges,
        avgBrawlerTrophies,
      }
    };

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
