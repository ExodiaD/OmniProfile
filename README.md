# 🌟 OmniProfile

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
</div>

<br/>

O **OmniProfile** é uma aplicação web construída com Next.js que centraliza dados de múltiplas plataformas num único painel de controlo (dashboard). Atualmente suporta integrações com **GitHub**, **Brawl Stars** e todo o ecossistema **Supercell**.

---

## ✨ Funcionalidades

- 📊 **Dashboard Centralizado**: Visualização de estatísticas através de gráficos e tabelas (recharts).
- 💻 **Integração GitHub**: Extração e apresentação de métricas de repositórios e atividade.
- 🎮 **Integração Gaming**: Dados em tempo real do Brawl Stars e contas Supercell.
- ⚡ **Cache de Dados**: Implementação de Redis para otimização de chamadas às APIs externas.
- 🌍 **Internacionalização (i18n)**: Suporte para múltiplos idiomas.
- 📱 **Interface Responsiva**: Construída com Tailwind CSS e componentes Radix UI (Shadcn).

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia |
| --- | --- |
| **Framework** | Next.js 15 (App Router) |
| **Linguagem** | TypeScript |
| **Estilização** | Tailwind CSS |
| **Componentes UI**| Shadcn UI (Radix) |
| **Armazenamento** | Redis |
| **Ícones** | Lucide React |

---

## ⚙️ Pré-requisitos

Certifica-te de que tens as seguintes ferramentas instaladas:

- **Node.js** (v18 ou superior)
- **npm** ou **pnpm**
- Instância **Redis** (local ou cloud, ex: Upstash)
- Chaves de API para os serviços integrados (GitHub, Brawl Stars).

---

## 🚀 Instalação e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/ExodiaD/OmniProfile.git
cd OmniProfile
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Cria um ficheiro `.env.local` na raiz do projeto com as seguintes variáveis (ajusta conforme necessário):
```env
# Redis
REDIS_URL=redis://localhost:6379

# APIs Externas
GITHUB_TOKEN=teu_token_github
BRAWLSTARS_API_KEY=tua_api_key_brawlstars
SUPERCELL_API_KEY=tua_api_key_supercell
```

### 4. Executar o servidor de desenvolvimento
```bash
npm run dev
```

### 5. Aceder à aplicação
Abre o navegador em [http://localhost:3000](http://localhost:3000).

---

## 📂 Estrutura do Projeto

- 📁 `/src/app`: Rotas da aplicação e endpoints de API (`/api/github`, `/api/brawlstars`, `/api/supercell`).
- 📁 `/src/components`: Componentes reutilizáveis, views específicas de integração e componentes Shadcn (`/ui`).
- 📁 `/src/lib`: Funções utilitárias, configuração do cliente Redis e lógica de internacionalização.
- 📁 `/public`: Recursos estáticos (SVG, ícones).

---

## 📜 Licença

Este projeto está licenciado sob a Licença **MIT**. Consulta o ficheiro `LICENSE` para mais detalhes.