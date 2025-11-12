# 🎙️ Flow CMS - Sistema de Gerenciamento de Podcast

Sistema de gerenciamento completo personalizado para **Estúdios Flow**, o maior podcast do Brasil. Gerencie episódios, convidados e patrocinadores com uma interface moderna e vibrante.

![Version](https://img.shields.io/badge/version-0.4.0-purple.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

---

## 🚀 Sobre o Flow CMS

Sistema personalizado desenvolvido para **Estúdios Flow** (5.4M+ inscritos no YouTube), oferecendo uma plataforma completa para gerenciar todo o ecossistema do podcast: episódios, convidados, patrocinadores e conteúdo premium.

### 🎨 Design Flow

- **Cores da marca**: Gradiente vibrante roxo (#8B5CF6), rosa (#EC4899) e azul (#3B82F6)
- **Estilo**: Moderno, energético e dinâmico
- **UX**: Interface intuitiva em português brasileiro
- **Responsivo**: Funciona perfeitamente em desktop e mobile

---

## ✅ Funcionalidades Implementadas

### **Gestão de Episódios**
- Criar, editar e deletar episódios
- Integração automática com YouTube (thumbnail e embed)
- Conteúdo premium (exclusivo para assinantes)
- Descrições ricas e data de publicação
- Grid responsivo na página pública

### **CRM de Convidados**
- Perfis completos de convidados
- Tópicos de interesse
- Estilo de comunicação
- Histórico de participações
- Interface visual com cards

### **Gestão de Patrocinadores**
- Perfis de patrocinadores com logo
- Informações de contato
- Geo-targeting por estados/regiões brasileiras
- Website e informações comerciais
- Proteção contra exclusão acidental

### **Autenticação & Segurança**
- Google OAuth via Supabase
- Rotas administrativas protegidas
- Row-level security (RLS)
- Controle de sessão
- Níveis de acesso (admin, premium, free)

### **Dashboard Administrativo**
- Estatísticas em tempo real
- Cards com gradiente Flow
- Navegação lateral elegante
- Ações rápidas
- Perfil do usuário

### **Páginas Públicas**
- Página inicial com branding Flow
- Listagem de episódios
- Thumbnails do YouTube
- Design mobile-first
- Indicadores de conteúdo premium

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **React 19.2.0** - Biblioteca UI
- **TypeScript 5** - JavaScript tipado
- **Tailwind CSS v4** - Framework CSS utility-first
- **Inter Font** - Tipografia moderna

### **Backend**
- **Next.js API Routes** - Serverless functions
- **Supabase** - Banco de dados PostgreSQL
- **Supabase Auth** - Autenticação e gestão de usuários
- **Supabase Storage** - Armazenamento de arquivos

### **Deployment**
- **Vercel** - Hosting (recomendado)
- **Supabase Cloud** - Database hosting

### **Ferramentas de Desenvolvimento**
- **Claude Code** - Assistente AI
- **Git & GitHub** - Controle de versão

---

## 📁 Estrutura do Projeto

```
podbrain/
├── app/
│   ├── page.tsx                           # Landing page Flow
│   ├── globals.css                        # Flow brand colors & theme
│   ├── layout.tsx                         # Root layout
│   ├── login/
│   │   └── page.tsx                       # Login com Google
│   ├── episodes/
│   │   ├── page.tsx                       # Listagem pública
│   │   └── [id]/
│   │       └── page.tsx                   # Detalhes do episódio
│   ├── admin/
│   │   ├── layout.tsx                     # Layout admin com sidebar Flow
│   │   ├── page.tsx                       # Dashboard
│   │   ├── episodes/
│   │   │   ├── page.tsx                   # Lista de episódios
│   │   │   ├── new/page.tsx               # Criar episódio
│   │   │   └── [id]/edit/page.tsx         # Editar episódio
│   │   ├── guests/
│   │   │   ├── page.tsx                   # Lista de convidados
│   │   │   ├── new/page.tsx               # Criar convidado
│   │   │   └── [id]/edit/page.tsx         # Editar convidado
│   │   └── sponsors/
│   │       ├── page.tsx                   # Lista de patrocinadores
│   │       ├── new/page.tsx               # Criar patrocinador
│   │       └── [id]/edit/page.tsx         # Editar patrocinador
│   └── auth/
│       └── callback/
│           └── route.ts                   # OAuth callback
├── utils/
│   └── supabase.ts                        # Cliente Supabase
├── public/                                # Assets estáticos
├── .env.local                             # Variáveis de ambiente
├── CLAUDE.md                              # Contexto do projeto
├── README.md                              # Este arquivo
└── package.json                           # Dependências
```

---

## 🗄️ Banco de Dados

### **Tabelas Principais**

#### `users`
- Usuários do sistema (admin e assinantes)
- Tier de assinatura (free/premium)

#### `episodes`
- Episódios do podcast
- YouTube URL, descrição, premium flag
- Timestamps de publicação

#### `guests`
- Perfis de convidados
- CRM completo (bio, contato, tópicos)
- Estilo de comunicação

#### `episode_guests`
- Relacionamento episódio-convidado
- Número da aparição

#### `sponsors`
- Patrocinadores
- Logo, website, geo-targeting

#### `episode_sponsors`
- Placements de patrocínio
- Tipos: banner_top, banner_mid, banner_end
- Analytics: clicks, impressions

---

## 🚀 Como Usar

### **Pré-requisitos**
- Node.js 18+
- Conta Supabase
- Conta Google Cloud (para OAuth)

### **Instalação**

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ia-brain/podbrain.git
   cd podbrain
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_supabase
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Configure o banco de dados no Supabase**
   - Execute os scripts SQL do projeto
   - Configure as políticas RLS

5. **Configure Google OAuth**
   - Crie credenciais no Google Cloud Console
   - Configure no Supabase → Authentication → Providers

6. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

7. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

---

## 🎨 Personalização Flow

### **Paleta de Cores**

As cores Flow estão definidas em `app/globals.css`:

```css
:root {
  --flow-purple-primary: #8B5CF6;
  --flow-pink-primary: #EC4899;
  --flow-blue-primary: #3B82F6;
  --gradient-flow: linear-gradient(135deg, var(--flow-purple-primary), var(--flow-pink-primary));
}
```

### **Utilidades CSS Customizadas**

```css
.gradient-flow           /* Gradiente roxo → rosa */
.text-gradient-flow      /* Texto com gradiente */
```

### **Modificando o Design**

1. **Cores**: Edite as variáveis CSS em `globals.css`
2. **Navegação**: Modifique `app/admin/layout.tsx`
3. **Landing Page**: Personalize `app/page.tsx`

---

## 📝 Guia de Uso

### **Criar Episódio**
1. Faça login no painel admin
2. Navegue para **Episódios** → **Novo Episódio**
3. Preencha título, YouTube URL, descrição
4. Marque como premium se necessário
5. Clique em **Criar Episódio**

### **Gerenciar Convidados**
1. Vá para **Convidados** → **Novo Convidado**
2. Adicione informações básicas e CRM
3. Defina tópicos de interesse
4. Escolha estilo de comunicação
5. Salve o perfil

### **Gerenciar Patrocinadores**
1. Acesse **Patrocinadores** → **Novo Patrocinador**
2. Preencha dados comerciais
3. Adicione logo URL
4. Selecione geo-targeting
5. Salve as informações

---

## 🚀 Deploy

### **Deploy no Vercel (Recomendado)**

1. **Push para GitHub**
   ```bash
   git push origin master
   ```

2. **Conecte ao Vercel**
   - Vá para [vercel.com](https://vercel.com)
   - Importe o repositório
   - Adicione as variáveis de ambiente
   - Deploy!

3. **Configure OAuth para produção**
   - Adicione URL de produção no Google OAuth
   - Atualize redirect URLs no Supabase

---

## 🐛 Troubleshooting

### **Erro de autenticação**
- Verifique credenciais Google OAuth
- Confirme redirect URI no Supabase
- Certifique-se que cookies estão habilitados

### **Thumbnails do YouTube não carregam**
- Valide formato da URL do YouTube
- Teste URL diretamente no navegador
- Verifique ID do vídeo extraído

### **Erros de banco de dados**
- Confirme políticas RLS no Supabase
- Verifique foreign keys
- Teste queries no SQL Editor

---

## 🗺️ Roadmap

### **Próximas Funcionalidades**
- [ ] Vincular convidados aos episódios (interface admin)
- [ ] Vincular patrocinadores com timestamps
- [ ] Analytics de performance de patrocínios
- [ ] Integração com YouTube Analytics
- [ ] Sistema de assinatura (Stripe)
- [ ] Conteúdo exclusivo premium
- [ ] Geração de clipes com IA
- [ ] RSS feed automático

### **Futuro**
- [ ] Integração Spotify
- [ ] Transcrição automática
- [ ] SEO avançado
- [ ] Compartilhamento social
- [ ] Sistema de comentários
- [ ] App mobile

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

## 📊 Estatísticas do Projeto

- **Linhas de código**: ~2,500+
- **Tempo de desenvolvimento**: 2 dias
- **Tecnologias**: 8+
- **Tabelas no banco**: 6
- **Páginas admin**: 10+
- **Sistemas CRUD**: 3

---

## 👤 Desenvolvedor

**Desenvolvido com assistência de IA**
- Built with Claude Code
- Customizado para Estúdios Flow
- Novembro 2025

---

## 🙏 Reconhecimentos

- Design inspirado pela identidade visual do Flow Podcast
- Desenvolvido com Claude (Anthropic)
- Assistência via Claude Code
- Interface moderna e brasileira

---

## 💜 Flow Podcast

Sistema personalizado para o **maior podcast do Brasil**

- 🎙️ **5.4M+ inscritos** no YouTube
- 🇧🇷 **Conteúdo brasileiro** autêntico
- 🔥 **Episódios semanais** com grandes nomes
- 💼 **Patrocinadores nacionais** e internacionais

---

**Feito com ❤️ para o Flow Podcast**

*Última atualização: Novembro 2025*
