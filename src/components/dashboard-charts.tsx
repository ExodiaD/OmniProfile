'use client';

import { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/lib/i18n';

// Generate mock historical data based on current stats to simulate trends
function generateMockData(currentValue: number, months: number = 6) {
  const data = [];
  const now = new Date();
  
  let value = Math.max(1, Math.round(currentValue * 0.5)); // Start at 50%
  const growthRate = (currentValue - value) / months;

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toLocaleDateString(undefined, { month: 'short' });
    
    // Add some randomness to growth
    const variance = value * 0.1;
    let pointValue = i === 0 ? currentValue : Math.round(value + growthRate * (months - i) + (Math.random() * variance - variance/2));
    
    data.push({
      name: monthStr,
      value: Math.max(0, pointValue)
    });
  }
  
  return data;
}

export function DashboardCharts({ userData, provider = 'github' }: { userData: any, provider?: 'github' | 'supercell' | 'brawlstars' }) {
  const { t } = useI18n();
  
  // Choose keys based on provider
  const metric1 = provider === 'github' ? userData.followers : userData.trophies;
  const metric2 = provider === 'github' ? userData.public_repos : provider === 'supercell' ? userData.wins : userData['3vs3Victories'];

  const data1 = useMemo(() => generateMockData(metric1), [metric1]);
  const data2 = useMemo(() => generateMockData(metric2), [metric2]);

  const combinedData = useMemo(() => {
    return data1.map((d, i) => ({
      name: d.name,
      primary: d.value,
      secondary: data2[i]?.value || 0
    }));
  }, [data1, data2]);

  const primaryName = provider === 'github' ? t('followers') : t('trophies');
  const secondaryName = provider === 'github' ? t('publicRepos') : provider === 'supercell' ? t('wins') : t('3v3Victories');
  const primaryColor = provider === 'github' ? '#6366f1' : provider === 'supercell' ? '#f59e0b' : '#f59e0b'; // amber for both trophies
  const secondaryColor = provider === 'github' ? '#a855f7' : provider === 'supercell' ? '#10b981' : '#3b82f6'; // blue for 3v3

  return (
    <Tabs defaultValue="primary" className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="primary">{provider === 'github' ? t('tabFollowers') : t('trophies')}</TabsTrigger>
          <TabsTrigger value="activity">{provider === 'github' ? t('tabActivity') : provider === 'supercell' ? t('wins') : t('3v3Victories')}</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="primary" className="flex-1 mt-0 h-full w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data1} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-slate-500 dark:text-slate-400" />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-slate-500 dark:text-slate-400" />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: primaryColor, fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorPrimary)" />
          </AreaChart>
        </ResponsiveContainer>
      </TabsContent>
      
      <TabsContent value="activity" className="flex-1 mt-0 h-full w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={combinedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-slate-500 dark:text-slate-400" />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-slate-500 dark:text-slate-400" />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-slate-500 dark:text-slate-400" />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}/>
            <Bar yAxisId="left" dataKey="primary" name={primaryName} fill={primaryColor} radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="secondary" name={secondaryName} fill={secondaryColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
}
