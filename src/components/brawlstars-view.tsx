'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, Target, Shield, RefreshCw, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DashboardCharts } from './dashboard-charts';

function MetricCard({ title, value, icon, trend, color, language }: { title: string, value: string | number, icon: React.ReactNode, trend: string, color: string, language: string }) {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className={`p-2 rounded-lg bg-${color}-500/10 dark:bg-${color}-500/20`}>{icon}</div>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{typeof value === 'number' ? value.toLocaleString(language) : value}</h3>
          <p className={`text-xs font-medium text-${color}-600 dark:text-${color}-400`}>{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatBox({ label, value, color }: { label: string, value: string | number, color?: string }) {
  const c = color || 'slate';
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{label}</span>
      <span className={`font-bold text-sm text-${c}-600 dark:text-${c}-400`}>{value}</span>
    </div>
  );
}

export function BrawlStarsView({ data, t, language }: { data: any, t: any, language: string }) {
  const p = data.data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-xl ring-2 ring-amber-500/20 bg-amber-100 dark:bg-amber-900/50 p-2">
            <AvatarImage src={p.avatarUrl} alt={p.name} className="rounded-xl" />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-amber-400 to-orange-500 text-white">{p.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold">{p.name}</h2>
              <Badge variant={data.source === 'cache' ? 'secondary' : 'default'} className="rounded-full px-3 shadow-sm font-medium">{data.source === 'cache' ? t('cached') : data.source === 'mock-api' ? 'Mock Data' : t('liveApi')}</Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm font-bold mt-2">{p.tag}</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-center">
          <div className="px-6 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('totalVictories')}</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{p.totalVictories?.toLocaleString(language)}</p>
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title={t('trophies')} value={p.trophies} icon={<Trophy className="w-5 h-5 text-amber-500" />} trend={`Best: ${p.highestTrophies}`} color="amber" language={language} />
        <MetricCard title={t('3v3Victories')} value={p['3vs3Victories']} icon={<Users className="w-5 h-5 text-blue-500" />} trend={t('trendActive')} color="blue" language={language} />
        <MetricCard title={t('soloVictories')} value={p.soloVictories} icon={<Shield className="w-5 h-5 text-rose-500" />} trend={t('trendStable')} color="rose" language={language} />
        <MetricCard title={t('duoVictories')} value={p.duoVictories} icon={<Target className="w-5 h-5 text-emerald-500" />} trend={p.club?.name ? `${t('club')}: ${p.club.name}` : `Lvl ${p.expLevel}`} color="emerald" language={language} />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {p.club?.name && <StatBox label={t('club')} value={p.club.name} />}
        <StatBox label={t('brawlersUnlocked')} value={p.brawlers?.length || 0} color="blue" />
        <StatBox label="Ranked (Current)" value={p.rankedRankName || 'N/A'} color="purple" />
        <StatBox label="Ranked Elo" value={p.rankedElo || 0} color="indigo" />
        <StatBox label="All-Time Best Rank" value={p.highestAllTimeRankedRankName || 'N/A'} color="amber" />
        <StatBox label="All-Time Best Elo" value={p.highestAllTimeRankedElo || 0} color="amber" />
        <StatBox label="Season Best" value={p.highestSeasonRankedRankName || 'N/A'} color="teal" />
        <StatBox label="Prestige" value={p.totalPrestigeLevel || 0} color="rose" />
        <StatBox label="EXP Level" value={p.expLevel} color="cyan" />
        {p.stats && <StatBox label="Power 11+" value={p.stats.maxPowerBrawlers} color="emerald" />}
        {p.stats && <StatBox label="Total Gadgets" value={p.stats.totalGadgets} color="blue" />}
        {p.stats && <StatBox label="Total Star Powers" value={p.stats.totalStarPowers} color="purple" />}
        {p.stats && <StatBox label="Total Gears" value={p.stats.totalGears} color="indigo" />}
        {p.stats && <StatBox label="HyperCharges" value={p.stats.totalHyperCharges} color="rose" />}
        {p.stats && <StatBox label="Avg Trophies/Brawler" value={p.stats.avgBrawlerTrophies} color="amber" />}
        <StatBox label="Best Robo Rumble" value={`${p.bestRoboRumbleTime || 0}s`} color="rose" />
      </div>

      {/* Charts + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader><CardTitle>{t('battleTrends')}</CardTitle><CardDescription>{t('battleDesc')}</CardDescription></CardHeader>
          <CardContent className="h-[350px]"><DashboardCharts userData={p} provider="brawlstars" /></CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-900/20 dark:to-orange-900/20">
          <CardHeader><CardTitle>{t('profileTitle')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 shadow-sm">
                <h4 className="font-semibold flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-amber-500" />{t('strengths')}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {(p.totalVictories > 0 && (p['3vs3Victories'] / p.totalVictories) > 0.65) ? t('strengthBrawl1') : p.trophies > 20000 ? t('strengthBrawl2') : t('strengthBrawl3')}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 shadow-sm">
                <h4 className="font-semibold flex items-center gap-2 mb-2"><RefreshCw className="w-4 h-4 text-blue-500" />{t('opportunities')}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{p.soloVictories < p.duoVictories ? t('oppBrawl1') : t('oppBrawl2')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Brawlers Collection */}
      {p.brawlers && p.brawlers.length > 0 && p.brawlers[0].name && (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Brawlers Collection</CardTitle>
            <CardDescription>{p.brawlers.length} brawlers unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3 max-h-[600px] overflow-y-auto pr-2 pb-2">
              {p.brawlers.slice().sort((a: any, b: any) => (b.trophies || 0) - (a.trophies || 0)).map((brawler: any, index: number) => (
                <div key={index} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                  <div className="w-14 h-14 rounded-lg bg-amber-100 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800/50 flex items-center justify-center relative overflow-hidden shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`} alt={brawler.name} className="w-full h-full object-cover scale-110" loading="lazy" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                    <span className="hidden text-[10px] font-black text-amber-600 dark:text-amber-500 text-center leading-tight p-0.5">{brawler.name?.substring(0, 3)}</span>
                  </div>
                  <div className="text-center w-full">
                    <p className="text-[10px] font-bold truncate uppercase" title={brawler.name}>{brawler.name}</p>
                    
                    <div className="flex justify-center gap-1 mt-1">
                      {brawler.rank > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400">R{brawler.rank}</span>}
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">Poder {brawler.power}</span>
                    </div>

                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      <Trophy className="w-2.5 h-2.5 text-amber-500" />
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{brawler.trophies}</span>
                    </div>
                    {brawler.highestTrophies > brawler.trophies && (
                      <div className="text-[8px] text-slate-400 dark:text-slate-500 mt-0.5">Best: {brawler.highestTrophies}</div>
                    )}
                    {(brawler.gadgets?.length > 0 || brawler.starPowers?.length > 0) && (
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        {brawler.gadgets?.length > 0 && <span className="text-[7px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1 rounded font-bold">{brawler.gadgets.length}G</span>}
                        {brawler.starPowers?.length > 0 && <span className="text-[7px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1 rounded font-bold">{brawler.starPowers.length}SP</span>}
                        {brawler.hyperCharges?.length > 0 && <span className="text-[7px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-1 rounded font-bold">HC</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
