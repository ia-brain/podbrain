import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Flow CMS</h1>
                <p className="text-xs text-white/80">Estúdios Flow</p>
              </div>
            </div>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition-all border border-white/30 hover:border-white/50 transform hover:scale-105"
            >
              Acessar
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium">5.4M+ inscritos no YouTube</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              O maior podcast
              <br />
              <span className="text-gradient-flow bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300">
                do Brasil
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Sistema de gerenciamento completo para episódios, convidados e patrocinadores do Flow Podcast
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/episodes"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 w-full sm:w-auto"
              >
                🎙️ Ver Episódios
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50 w-full sm:w-auto"
              >
                Área Administrativa →
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">1000+</div>
                <div className="text-white/70 font-medium">Episódios</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-white/70 font-medium">Convidados</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
                <div className="text-white/70 font-medium">Patrocinadores</div>
              </div>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Funcionalidades do Sistema
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon="🎙️"
                title="Gestão de Episódios"
                description="Gerencie episódios, links do YouTube, descrições e conteúdo premium"
              />
              <FeatureCard
                icon="👥"
                title="CRM de Convidados"
                description="Controle completo de convidados, histórico e preferências de comunicação"
              />
              <FeatureCard
                icon="💼"
                title="Patrocinadores"
                description="Gestão de patrocínios, placements e analytics de performance"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 text-center">
          <div className="text-white/60 text-sm">
            <p>© 2024 Estúdios Flow. Sistema de gerenciamento de podcast.</p>
            <p className="mt-2">Feito com ❤️ para o maior podcast do Brasil</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all hover:transform hover:scale-105">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </div>
  )
}
