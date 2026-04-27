'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Swords, Target, Shield, RefreshCw, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DashboardCharts } from './dashboard-charts';

function MetricCard({ title, value, icon, trend, color, language }: { title: string, value: string | number, icon: React.ReactNode, trend: string, color: string, language: string }) {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{title}</p>
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

export function SupercellView({ data, t, language }: { data: any, t: any, language: string }) {
  const p = data.data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-xl ring-2 ring-emerald-500/20 bg-emerald-100 dark:bg-emerald-900/50 p-2">
            <AvatarImage src={p.avatarUrl} alt={p.name} className="rounded-xl" />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-emerald-400 to-teal-500 text-white">{p.name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('winRate')}</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{p.winRate}%</p>
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title={t('trophies')} value={p.trophies} icon={<Star className="w-5 h-5 text-amber-500" />} trend={`Best: ${p.bestTrophies}`} color="amber" language={language} />
        <MetricCard title={t('wins')} value={p.wins} icon={<Swords className="w-5 h-5 text-emerald-500" />} trend={`3-Crown: ${p.threeCrownWins || 0}`} color="emerald" language={language} />
        <MetricCard title={t('losses')} value={p.losses} icon={<Shield className="w-5 h-5 text-rose-500" />} trend={`Total: ${p.battleCount} battles`} color="rose" language={language} />
        <MetricCard title={t('arena')} value={p.arena?.name || 'N/A'} icon={<Target className="w-5 h-5 text-indigo-500" />} trend={`${t('level')} ${p.expLevel}`} color="indigo" language={language} />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {p.clan?.name && <StatBox label={`${t('club')} / ${t('role')}`} value={`${p.clan.name} (${p.role})`} />}
        <StatBox label={t('donations')} value={p.donations} color="emerald" />
        <StatBox label={t('totalDonations')} value={p.totalDonations} color="blue" />
        {p.favoriteCard?.name && <StatBox label={t('favoriteCard')} value={p.favoriteCard.name} color="amber" />}
        <StatBox label="3-Crown Wins" value={p.threeCrownWins || 0} color="purple" />
        <StatBox label="Challenge Max" value={`${p.challengeMaxWins || 0} wins`} color="indigo" />
        <StatBox label="War Day Wins" value={p.warDayWins || 0} color="teal" />
        <StatBox label="Star Points" value={(p.starPoints || 0).toLocaleString(language)} color="yellow" />
        <StatBox label="Total EXP" value={(p.totalExpPoints || 0).toLocaleString(language)} color="cyan" />
        {p.cardStats && <StatBox label="Cards / Maxed" value={`${p.cardStats.total} / ${p.cardStats.maxed}`} color="emerald" />}
        {p.cardStats && <StatBox label="Avg Card Lvl" value={p.cardStats.avgLevel} color="blue" />}
        <StatBox label={t('battleCount')} value={p.battleCount} color="rose" />
      </div>

      {/* Charts + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader><CardTitle>{t('battleTrends')}</CardTitle><CardDescription>{t('battleDesc')}</CardDescription></CardHeader>
          <CardContent className="h-[350px]"><DashboardCharts userData={p} provider="supercell" /></CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-900/20 dark:to-teal-900/20">
          <CardHeader><CardTitle>{t('profileTitle')}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 shadow-sm">
                <h4 className="font-semibold flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-amber-500" />{t('strengths')}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{p.winRate > 52 ? t('strengthSupercell1') : p.trophies > 8500 ? t('strengthSupercell2') : t('strengthSupercell3')}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 shadow-sm">
                <h4 className="font-semibold flex items-center gap-2 mb-2"><RefreshCw className="w-4 h-4 text-blue-500" />{t('opportunities')}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{p.winRate < 50 ? t('oppSupercell1') : t('oppSupercell2')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Deck */}
      {p.currentDeck && p.currentDeck.length > 0 && (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader><CardTitle>{t('currentDeck') || 'Current Deck'}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {p.currentDeck.map((card: any, index: number) => {
                const level = 16 - ((card.maxLevel || 16) - (card.level || 1));
                const isChampion = card.rarity === 'champion';
                const isEvo = card.evolutionLevel && card.evolutionLevel > 0;
                return (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="relative w-16 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
                      {card.iconUrls?.medium ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.iconUrls.medium} alt={card.name} className="w-full h-full object-cover scale-110" />
                      ) : (<Star className="w-6 h-6 text-slate-400" />)}
                    </div>
                    <div className="flex flex-col items-center gap-0.5 w-full mt-1">
                      <span className="text-[10px] font-semibold text-center truncate w-full px-1" title={card.name}>{card.name}</span>
                      <div className="flex flex-wrap justify-center gap-1 mt-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">Lvl {level}</span>
                        {isChampion && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">Campeão</span>}
                        {isEvo && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400">Evo</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Cards Collection */}
      {p.cards && p.cards.length > 0 && (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Cards Collection</CardTitle>
            <CardDescription>{p.cards.length} cards unlocked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-[500px] overflow-y-auto pr-2">
              {p.cards.slice().sort((a: any, b: any) => (b.level || 1) - (a.level || 1)).map((card: any, i: number) => {
                const level = 16 - ((card.maxLevel || 16) - (card.level || 1));
                const isChampion = card.rarity === 'champion';
                const isEvo = card.evolutionLevel && card.evolutionLevel > 0;
                return (
                  <div key={i} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="relative w-full aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                      {card.iconUrls?.medium ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.iconUrls.medium} alt={card.name} className="w-full h-full object-cover scale-110" loading="lazy" />
                      ) : (<Star className="w-4 h-4 text-slate-400" />)}
                    </div>
                    <div className="flex flex-col items-center gap-1 w-full mt-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 w-full text-center">Lvl {level}</span>
                      {isChampion && <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 w-full text-center">Campeão</span>}
                      {isEvo && <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 w-full text-center">Evo</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges */}
      {p.badges && p.badges.length > 0 && (
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader><CardTitle>Badges</CardTitle><CardDescription>{p.badges.length} badges earned</CardDescription></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {p.badges.map((badge: any, i: number) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  {badge.iconUrls?.large ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={badge.iconUrls.large} alt={badge.name} className="w-10 h-10 object-contain" loading="lazy" />
                  ) : (<Star className="w-6 h-6 text-amber-500" />)}
                  <span className="text-[9px] font-bold text-center truncate w-full">{badge.name}</span>
                  {badge.progress !== undefined && badge.target && (
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (badge.progress / badge.target) * 100)}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
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
