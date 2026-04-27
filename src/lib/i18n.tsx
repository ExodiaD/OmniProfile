'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt-BR' | 'es';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  'en': {
    'title': 'Omni Profile',
    'subtitle': 'Real-time GitHub analytics and profile insights.',
    'searchPlaceholder': 'Search GitHub username...',
    'searchButton': 'Search',
    'searching': 'Searching...',
    'errorTitle': 'Error retrieving data',
    'tryAgain': 'Try Again',
    'cached': '⚡ Cached',
    'liveApi': '🌐 Live API',
    'joined': 'Joined',
    'engagementScore': 'Engagement Score',
    'followers': 'Followers',
    'following': 'Following',
    'publicRepos': 'Public Repos',
    'globalRank': 'Global Rank (Est.)',
    'trendFollowers': '+12% from last month',
    'trendStable': 'Stable',
    'trendActive': 'Active contributor',
    'trendRank': 'Based on followers',
    'growthTitle': 'Growth & Activity Trends',
    'growthDesc': 'Simulated historical data based on current metrics',
    'profileTitle': 'Profile Analysis',
    'profileDesc': 'AI-generated insights',
    'strengths': 'Strengths',
    'opportunities': 'Opportunities',
    'strength1': 'Exceptional community reach with a massive follower base.',
    'strength2': 'Highly active developer with a vast portfolio of projects.',
    'strength3': 'Steady growth and consistent engagement metrics.',
    'opp1': 'Consider following more community leaders to expand network.',
    'opp2': 'Maintain current repository update frequency to boost visibility.',
    'tabFollowers': 'Follower Growth',
    'tabActivity': 'Repository Activity',
    'language': 'Language',
    'selectProvider': 'Select Provider',
    'githubDesc': 'Developer stats & repos',
    'supercellDesc': 'Player stats & trophies',
    'playerTagPlaceholder': 'Search Player Tag (e.g. #CRVP2U9)',
    'trophies': 'Trophies',
    'highestTrophies': 'Highest Trophies',
    'wins': 'Wins',
    'losses': 'Losses',
    'winRate': 'Win Rate',
    'level': 'Level',
    'arena': 'Arena',
    'battleTrends': 'Battle Trends',
    'battleDesc': 'Recent battle performance and trophies',
    'strengthSupercell1': 'Excellent win rate compared to average players.',
    'strengthSupercell2': 'High trophy pushing activity recently.',
    'strengthSupercell3': 'Solid overall performance.',
    'oppSupercell1': 'Needs to improve defense to avoid trophy drops.',
    'oppSupercell2': 'Try upgrading core cards to progress further.',
    'welcomeTitle': 'Choose Your Analytics Profile',
    'welcomeSubtitle': 'Select a platform to view real-time statistics and insights.',
    'startGithub': 'Explore GitHub Profiles',
    'startSupercell': 'Explore Clash Royale Stats',
    'startBrawlStars': 'Explore Brawl Stars Stats',
    'backToSelection': 'Change Provider',
    'brawlDesc': 'Brawler stats & trophies',
    'highestTrophiesBrawl': 'Highest Trophies',
    'totalVictories': 'Total Victories',
    '3v3Victories': '3v3 Victories',
    'soloVictories': 'Solo Victories',
    'duoVictories': 'Duo Victories',
    'club': 'Club',
    'strengthBrawl1': 'Excellent team player with high 3v3 win rate.',
    'strengthBrawl2': 'Very high trophy pushing activity recently.',
    'strengthBrawl3': 'Solid overall performance across modes.',
    'oppBrawl1': 'Needs to improve solo showdown strategies.',
    'oppBrawl2': 'Try playing more diverse game modes.',
    'bio': 'Bio',
    'location': 'Location',
    'company': 'Company',
    'blog': 'Website',
    'donations': 'Donations',
    'totalDonations': 'Total Donations',
    'favoriteCard': 'Favorite Card',
    'battleCount': 'Total Battles',
    'cardsFound': 'Cards Found',
    'brawlersUnlocked': 'Brawlers Unlocked',
    'rankedElo': 'Ranked Elo',
    'role': 'Role',
    'currentDeck': 'Current Deck',
    'currentDeckDesc': 'The 8 cards currently equipped for battle.',
    'topBrawlers': 'Top Brawlers',
    'topBrawlersDesc': 'Your highest trophy brawlers.',
  },
  'pt-BR': {
    'title': 'Omni Profile',
    'subtitle': 'Análises e insights de perfis do GitHub em tempo real.',
    'searchPlaceholder': 'Buscar usuário do GitHub...',
    'searchButton': 'Buscar',
    'searching': 'Buscando...',
    'errorTitle': 'Erro ao recuperar os dados',
    'tryAgain': 'Tentar Novamente',
    'cached': '⚡ Em Cache',
    'liveApi': '🌐 API Ao Vivo',
    'joined': 'Entrou em',
    'engagementScore': 'Pontuação de Engajamento',
    'followers': 'Seguidores',
    'following': 'Seguindo',
    'publicRepos': 'Repositórios Públicos',
    'globalRank': 'Ranking Global (Est.)',
    'trendFollowers': '+12% desde o mês passado',
    'trendStable': 'Estável',
    'trendActive': 'Contribuidor ativo',
    'trendRank': 'Baseado em seguidores',
    'growthTitle': 'Tendências de Crescimento e Atividade',
    'growthDesc': 'Dados históricos simulados baseados nas métricas atuais',
    'profileTitle': 'Análise de Perfil',
    'profileDesc': 'Insights gerados por IA',
    'strengths': 'Pontos Fortes',
    'opportunities': 'Oportunidades',
    'strength1': 'Alcance comunitário excepcional com uma enorme base de seguidores.',
    'strength2': 'Desenvolvedor altamente ativo com um vasto portfólio de projetos.',
    'strength3': 'Crescimento constante e métricas de engajamento consistentes.',
    'opp1': 'Considere seguir mais líderes da comunidade para expandir sua rede.',
    'opp2': 'Mantenha a frequência atual de atualizações de repositórios para aumentar a visibilidade.',
    'tabFollowers': 'Crescimento de Seguidores',
    'tabActivity': 'Atividade de Repositórios',
    'language': 'Idioma',
    'selectProvider': 'Escolher Provedor',
    'githubDesc': 'Status de dev & repos',
    'supercellDesc': 'Status de jogador & troféus',
    'playerTagPlaceholder': 'Buscar Player Tag (ex: #CRVP2U9)',
    'trophies': 'Troféus',
    'highestTrophies': 'Recorde de Troféus',
    'wins': 'Vitórias',
    'losses': 'Derrotas',
    'winRate': 'Taxa de Vitória',
    'level': 'Nível',
    'arena': 'Arena',
    'battleTrends': 'Tendências de Batalha',
    'battleDesc': 'Performance recente e troféus',
    'strengthSupercell1': 'Excelente taxa de vitória comparado à média.',
    'strengthSupercell2': 'Atividade alta em progressão de troféus.',
    'strengthSupercell3': 'Desempenho geral sólido.',
    'oppSupercell1': 'Precisa melhorar a defesa para evitar perda de troféus.',
    'oppSupercell2': 'Tente melhorar as cartas principais para progredir.',
    'welcomeTitle': 'Escolha seu Perfil de Análise',
    'welcomeSubtitle': 'Selecione uma plataforma para ver estatísticas e insights em tempo real.',
    'startGithub': 'Explorar Perfis do GitHub',
    'startSupercell': 'Explorar Status Clash Royale',
    'startBrawlStars': 'Explorar Status Brawl Stars',
    'backToSelection': 'Mudar Provedor',
    'brawlDesc': 'Status de brawler e troféus',
    'highestTrophiesBrawl': 'Recorde de Troféus',
    'totalVictories': 'Vitórias Totais',
    '3v3Victories': 'Vitórias 3v3',
    'soloVictories': 'Vitórias Combate Solo',
    'duoVictories': 'Vitórias Combate Duplo',
    'club': 'Clube',
    'strengthBrawl1': 'Excelente jogador de equipe com alta taxa de vitória 3v3.',
    'strengthBrawl2': 'Atividade muito alta em progressão de troféus recentemente.',
    'strengthBrawl3': 'Desempenho geral sólido em vários modos.',
    'oppBrawl1': 'Precisa melhorar as estratégias no Combate Solo.',
    'oppBrawl2': 'Tente jogar modos de jogo mais diversos.',
    'bio': 'Biografia',
    'location': 'Localização',
    'company': 'Empresa',
    'blog': 'Site',
    'donations': 'Doações',
    'totalDonations': 'Doações Totais',
    'favoriteCard': 'Carta Favorita',
    'battleCount': 'Total de Batalhas',
    'cardsFound': 'Cartas Encontradas',
    'brawlersUnlocked': 'Brawlers Desbloqueados',
    'rankedElo': 'Ranked Elo',
    'role': 'Cargo',
    'currentDeck': 'Deck Atual',
    'currentDeckDesc': 'As 8 cartas equipadas para a batalha.',
    'topBrawlers': 'Melhores Brawlers',
    'topBrawlersDesc': 'Seus brawlers com mais troféus.',
  },
  'es': {
    'title': 'Omni Profile',
    'subtitle': 'Análisis e información de perfiles de GitHub en tiempo real.',
    'searchPlaceholder': 'Buscar usuario de GitHub...',
    'searchButton': 'Buscar',
    'searching': 'Buscando...',
    'errorTitle': 'Error al recuperar datos',
    'tryAgain': 'Intentar de nuevo',
    'cached': '⚡ En Caché',
    'liveApi': '🌐 API en Vivo',
    'joined': 'Se unió en',
    'engagementScore': 'Puntuación de Participación',
    'followers': 'Seguidores',
    'following': 'Siguiendo',
    'publicRepos': 'Repositorios Públicos',
    'globalRank': 'Rango Global (Est.)',
    'trendFollowers': '+12% desde el mes pasado',
    'trendStable': 'Estable',
    'trendActive': 'Colaborador activo',
    'trendRank': 'Basado en seguidores',
    'growthTitle': 'Tendencias de Crecimiento y Actividad',
    'growthDesc': 'Datos históricos simulados basados en métricas actuales',
    'profileTitle': 'Análisis de Perfil',
    'profileDesc': 'Información generada por IA',
    'strengths': 'Puntos Fuertes',
    'opportunities': 'Oportunidades',
    'strength1': 'Alcance comunitario excepcional con una enorme base de seguidores.',
    'strength2': 'Desarrollador altamente activo con un vasto portafolio de proyectos.',
    'strength3': 'Crecimiento constante y métricas de participación consistentes.',
    'opp1': 'Considera seguir a más líderes de la comunidad para expandir tu red.',
    'opp2': 'Mantén la frecuencia actual de actualización de repositorios para impulsar la visibilidad.',
    'tabFollowers': 'Crecimiento de Seguidores',
    'tabActivity': 'Actividad de Repositorios',
    'language': 'Idioma',
    'selectProvider': 'Seleccionar Proveedor',
    'githubDesc': 'Estadísticas de dev y repos',
    'supercellDesc': 'Estadísticas de jugador y trofeos',
    'playerTagPlaceholder': 'Buscar Player Tag (ej: #CRVP2U9)',
    'trophies': 'Trofeos',
    'highestTrophies': 'Récord de Trofeos',
    'wins': 'Victorias',
    'losses': 'Derrotas',
    'winRate': 'Tasa de Victoria',
    'level': 'Nivel',
    'arena': 'Arena',
    'battleTrends': 'Tendencias de Batalla',
    'battleDesc': 'Rendimiento reciente y trofeos',
    'strengthSupercell1': 'Excelente tasa de victoria en comparación con la media.',
    'strengthSupercell2': 'Alta actividad de progresión de trofeos recientemente.',
    'strengthSupercell3': 'Rendimiento general sólido.',
    'oppSupercell1': 'Necesita mejorar la defensa para evitar perder trofeos.',
    'oppSupercell2': 'Intenta mejorar las cartas principales para progresar.',
    'welcomeTitle': 'Elige tu Perfil de Análisis',
    'welcomeSubtitle': 'Selecciona una plataforma para ver estadísticas e información en tiempo real.',
    'startGithub': 'Explorar Perfiles de GitHub',
    'startSupercell': 'Explorar Estadísticas de Clash Royale',
    'startBrawlStars': 'Explorar Estadísticas de Brawl Stars',
    'backToSelection': 'Cambiar Proveedor',
    'brawlDesc': 'Estadísticas de brawler y trofeos',
    'highestTrophiesBrawl': 'Récord de Trofeos',
    'totalVictories': 'Victorias Totales',
    '3v3Victories': 'Victorias 3v3',
    'soloVictories': 'Victorias Supervivencia Solo',
    'duoVictories': 'Victorias Supervivencia Dúo',
    'club': 'Club',
    'strengthBrawl1': 'Excelente jugador de equipo con alta tasa de victorias 3v3.',
    'strengthBrawl2': 'Actividad muy alta en progresión de trofeos recientemente.',
    'strengthBrawl3': 'Rendimiento general sólido en todos los modos.',
    'oppBrawl1': 'Necesita mejorar las estrategias de supervivencia en solitario.',
    'oppBrawl2': 'Intenta jugar modos de juego más diversos.',
    'bio': 'Biografía',
    'location': 'Ubicación',
    'company': 'Empresa',
    'blog': 'Sitio web',
    'donations': 'Donaciones',
    'totalDonations': 'Donaciones Totales',
    'favoriteCard': 'Carta Favorita',
    'battleCount': 'Total de Batallas',
    'cardsFound': 'Cartas Encontradas',
    'brawlersUnlocked': 'Brawlers Desbloqueados',
    'rankedElo': 'Elo Ranked',
    'role': 'Rol',
    'currentDeck': 'Mazo Actual',
    'currentDeckDesc': 'Las 8 cartas equipadas para la batalla.',
    'topBrawlers': 'Mejores Brawlers',
    'topBrawlersDesc': 'Tus brawlers con más trofeos.',
  }
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && ['en', 'pt-BR', 'es'].includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language;
      if (browserLang.startsWith('pt')) setLanguageState('pt-BR');
      else if (browserLang.startsWith('es')) setLanguageState('es');
      else setLanguageState('en');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
