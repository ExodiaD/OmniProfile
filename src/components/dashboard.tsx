'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, RefreshCw, Code, Users, BookOpen, Star, Globe, Swords, Target, Shield, Home, Gamepad2, Trophy, ExternalLink, Briefcase, MapPin, Link as LinkIcon, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DashboardCharts } from './dashboard-charts';
import { useI18n } from '@/lib/i18n';
import { SupercellView } from './supercell-view';
import { BrawlStarsView } from './brawlstars-view';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Provider = 'github' | 'supercell' | 'brawlstars' | null;

export function Dashboard() {
  const { t, language, setLanguage } = useI18n();
  const [provider, setProvider] = useState<Provider>(null);
  const [inputValue, setInputValue] = useState('');
  
  // Default values depending on provider
  const [githubQuery, setGithubQuery] = useState('ExodiaD');
  const [supercellQuery, setSupercellQuery] = useState('UU2ULCP09'); 
  const [brawlstarsQuery, setBrawlstarsQuery] = useState('PQ9CUG0V0');
  
  const activeQuery = provider === 'github' ? githubQuery : provider === 'supercell' ? supercellQuery : brawlstarsQuery;

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (currentProvider: Provider, currentQuery: string) => {
    if (!currentProvider || !currentQuery) return;
    
    setIsLoading(true);
    setIsFetching(true);
    setIsError(false);
    setError(null);
    setData(null);
    
    try {
      const endpoint = currentProvider === 'github' 
        ? `/api/github?username=${currentQuery}`
        : currentProvider === 'supercell'
        ? `/api/supercell?tag=${currentQuery}`
        : `/api/brawlstars?tag=${currentQuery}`;

      const res = await fetch(endpoint);
      if (!res.ok) {
        if (res.status === 429) throw new Error('Rate limit exceeded. Try again in a few seconds.');
        if (res.status === 404) throw new Error(currentProvider === 'github' ? 'User not found.' : 'Player not found.');
        throw new Error('Failed to fetch data');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchData(provider, activeQuery);
  }, [provider, activeQuery, fetchData]);

  const refetch = useCallback(() => {
    fetchData(provider, activeQuery);
  }, [provider, activeQuery, fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (provider === 'github') setGithubQuery(inputValue.trim());
      else if (provider === 'supercell') setSupercellQuery(inputValue.trim());
      else setBrawlstarsQuery(inputValue.trim());
    }
  };

  const switchProvider = (newVal: string) => {
    const newProvider = newVal as Provider;
    setProvider(newProvider);
    setInputValue(newProvider === 'github' ? githubQuery : newProvider === 'supercell' ? supercellQuery : brawlstarsQuery);
  };

  if (provider === null) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[80vh] space-y-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
            <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SelectValue placeholder={t('language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt-BR">Português (BR)</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-center space-y-4 max-w-2xl mt-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
            {t('welcomeTitle')}
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400">
            {t('welcomeSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <Card 
            className="group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            onClick={() => switchProvider('github')}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Code className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">GitHub</h2>
              <p className="text-slate-500 dark:text-slate-400">{t('githubDesc')}</p>
              <Button variant="outline" className="w-full mt-4 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                {t('startGithub')}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            onClick={() => switchProvider('supercell')}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Swords className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Clash Royale</h2>
              <p className="text-slate-500 dark:text-slate-400">{t('supercellDesc')}</p>
              <Button variant="outline" className="w-full mt-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                {t('startSupercell')}
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            onClick={() => switchProvider('brawlstars')}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Gamepad2 className="w-10 h-10 text-amber-500 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Brawl Stars</h2>
              <p className="text-slate-500 dark:text-slate-400">{t('brawlDesc')}</p>
              <Button variant="outline" className="w-full mt-4 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-colors">
                {t('startBrawlStars')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl animate-in fade-in duration-500">
      {/* Header and Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
            {t('title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {provider === 'github' ? t('githubDesc') : provider === 'supercell' ? t('supercellDesc') : t('brawlDesc')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 w-full xl:w-auto items-start lg:items-center">
          
          {/* Provider Tabs */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Button variant="outline" size="icon" onClick={() => setProvider(null)} title={t('backToSelection')} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shrink-0">
              <Home className="w-4 h-4" />
            </Button>
            <Tabs value={provider || ''} onValueChange={switchProvider} className="w-full lg:w-auto">
              <TabsList className="grid w-full lg:w-[320px] grid-cols-3 bg-slate-200/50 dark:bg-slate-800/50">
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="supercell">Clash</TabsTrigger>
                <TabsTrigger value="brawlstars">Brawl</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400 hidden lg:block" />
            <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
              <SelectTrigger className="w-full lg:w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <SelectValue placeholder={t('language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt-BR">Português (BR)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-auto">
            <Input 
              placeholder={provider === 'github' ? t('searchPlaceholder') : t('playerTagPlaceholder')} 
              className="w-full lg:w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type="submit" disabled={isFetching} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all">
              {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              <span className="hidden sm:inline">{isFetching ? t('searching') : t('searchButton')}</span>
            </Button>
          </form>
        </div>
      </div>

      {isError && (
        <Card className="bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-full">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">{t('errorTitle')}</h3>
                <p className="text-sm opacity-80">{(error as Error).message}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="border-red-500/20 hover:bg-red-500/10 text-red-500">
              {t('tryAgain')}
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="overflow-hidden border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
          <Card className="md:col-span-4 h-[400px]">
            <CardContent className="h-full flex items-center justify-center p-6">
              <Skeleton className="w-full h-full" />
            </CardContent>
          </Card>
        </div>
      )}

      {data && !isLoading && provider === 'github' && (
        <GithubView data={data} t={t} language={language} />
      )}

      {data && !isLoading && provider === 'supercell' && (
        <SupercellView data={data} t={t} language={language} />
      )}

      {data && !isLoading && provider === 'brawlstars' && (
        <BrawlStarsView data={data} t={t} language={language} />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// GITHUB VIEW
// -------------------------------------------------------------
function GithubView({ data, t, language }: { data: any, t: any, language: string }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-xl ring-2 ring-indigo-500/20">
            <AvatarImage src={data.data.avatar_url} alt={data.data.login} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
              {data.data.login.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <a href={data.data.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2 group" title="Visit GitHub Profile">
                <h2 className="text-3xl font-bold">{data.data.login}</h2>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </a>
              <Badge variant={data.source === 'cache' ? 'secondary' : 'default'} className="rounded-full px-3 shadow-sm font-medium">
                {data.source === 'cache' ? t('cached') : t('liveApi')}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-2">
              <Code className="w-4 h-4" /> 
              {t('joined')} {new Date(data.data.created_at).toLocaleDateString(language, { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4 text-center">
          <div className="px-6 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('engagementScore')}</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{data.data.engagement_score?.toLocaleString(language)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title={t('followers')} 
          value={data.data.followers} 
          icon={<Users className="w-5 h-5 text-blue-500" />} 
          trend={t('trendFollowers')}
          color="blue"
          language={language}
        />
        <MetricCard 
          title={t('following')} 
          value={data.data.following} 
          icon={<Users className="w-5 h-5 text-indigo-500" />} 
          trend={t('trendStable')}
          color="indigo"
          language={language}
        />
        <MetricCard 
          title={t('publicRepos')} 
          value={data.data.public_repos} 
          icon={<BookOpen className="w-5 h-5 text-purple-500" />} 
          trend={t('trendActive')}
          color="purple"
          language={language}
        />
        <MetricCard 
          title={t('globalRank')} 
          value={`Top ${Math.max(1, Math.round(100 - (data.data.followers / 1000)))}%`} 
          icon={<Star className="w-5 h-5 text-amber-500" />} 
          trend={t('trendRank')}
          color="amber"
          language={language}
        />
      </div>

      {(data.data.company || data.data.location || data.data.blog || data.data.bio) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {data.data.company && <div className="flex items-center gap-3 text-sm"><div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><Briefcase className="w-4 h-4 text-slate-600 dark:text-slate-400" /></div> <span className="font-medium">{data.data.company}</span></div>}
          {data.data.location && <div className="flex items-center gap-3 text-sm"><div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400" /></div> <span className="font-medium">{data.data.location}</span></div>}
          {data.data.blog && <div className="flex items-center gap-3 text-sm"><div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><LinkIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" /></div> <a href={data.data.blog.startsWith('http') ? data.data.blog : `https://${data.data.blog}`} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline break-all">{data.data.blog}</a></div>}
          {data.data.bio && <div className="flex items-start gap-3 text-sm md:col-span-3 mt-2"><div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0"><Info className="w-4 h-4 text-slate-600 dark:text-slate-400" /></div> <span className="text-slate-600 dark:text-slate-300 italic pt-1">"{data.data.bio}"</span></div>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>{t('growthTitle')}</CardTitle>
            <CardDescription>{t('growthDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <DashboardCharts userData={data.data} provider="github" />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle>{t('profileTitle')}</CardTitle>
            <CardDescription>{t('profileDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 shadow-sm">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  {t('strengths')}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {data.data.followers > 1000 
                    ? t('strength1') 
                    : data.data.public_repos > 50 
                    ? t('strength2')
                    : t('strength3')}
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 shadow-sm">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  {t('opportunities')}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {data.data.following < 10 
                    ? t('opp1') 
                    : t('opp2')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// MetricCard used by GithubView
function MetricCard({ title, value, icon, trend, color, language }: { title: string, value: string | number, icon: React.ReactNode, trend: string, color: string, language: string }) {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{title}</p>
          <div className={`p-2 rounded-lg bg-${color}-500/10 dark:bg-${color}-500/20`}>
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {typeof value === 'number' ? value.toLocaleString(language) : value}
          </h3>
          <p className={`text-xs font-medium text-${color}-600 dark:text-${color}-400`}>
            {trend}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
