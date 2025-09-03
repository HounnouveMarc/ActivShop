import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Trophy, Users } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 power-gradient opacity-80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-white">
            <span className="block">Tout le Fitness.</span>
            <span className="block brand-text-gradient">En un seul.</span>
            <span className="block text-secondary">Marché.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Forge ton destin avec des produits d'élite. 
            Chaque rep, chaque goutte de sueur, chaque victoire contribue à ton héritage éternel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild variant="hero" size="xl" className="group">
              <Link to="/boutique">
                Découvrir la Boutique
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button asChild variant="gold" size="xl">
              <Link to="/communaute">
                Rejoindre ActivShop Bénin
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Pourquoi Choisir <span className="brand-text-gradient">ActivShop Bénin</span> ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nous ne vendons pas juste des produits, nous forgeons des légendes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="fitness-card p-8 text-center group bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-power shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">L'Investissement Ultime</h3>
              <p className="text-gray-700 leading-relaxed">
                Ton corps est le seul endroit où tu vivras toute ta vie. 
                Le fitness n'est plus un effort, c'est un héritage personnel qui dure pour toujours.
                Investis dans ta santé et ta force - c'est la richesse la plus précieuse.
              </p>
            </div>

            <div className="fitness-card p-8 text-center group bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 hover:border-amber-300 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-power shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Univers Fitness Complet</h3>
              <p className="text-gray-700 leading-relaxed">
                Tout l'univers du fitness à ta portée : équipements, nutrition, vêtements et plus encore.
                Distribué depuis l'Afrique de l'Ouest avec rapidité et qualité.
                Chaque produit devient un outil pour dépasser tes limites et forger ton avenir.
              </p>
            </div>

            <div className="fitness-card p-8 text-center group bg-gradient-to-br from-red-50 to-pink-100 border-2 border-red-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-power shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Communauté ActivShop Bénin</h3>
              <p className="text-gray-700 leading-relaxed">
                Rejoins une communauté de guerriers partageant la même passion pour l'excellence.
                Ensemble, nous formons une force inarrêtable vers le succès et la réalisation de nos objectifs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Prêt à Forger Ton Héritage ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Commence ton voyage vers l'excellence dès aujourd'hui. 
            Chaque grand champion a commencé par un premier pas.
          </p>
          <Button asChild variant="power" size="xl" className="bg-brand-black border-white/20 hover:bg-brand-black/80">
            <Link to="/boutique">
              Commencer Maintenant
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;