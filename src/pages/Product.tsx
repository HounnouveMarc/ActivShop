import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Play, ExternalLink, CheckCircle } from "lucide-react";
// Chargement des produits via fetch depuis /public/data/products.json

// Import des images de produits
import creatineImage from "@/assets/creatine-product.jpg";
import jumpRopeImage from "@/assets/jump-rope-product.jpg";
import resistanceBandsImage from "@/assets/resistance-bands-product.jpg";

const imageMap = {
  "creatine-product.jpg": creatineImage,
  "jump-rope-product.jpg": jumpRopeImage,
  "resistance-bands-product.jpg": resistanceBandsImage,
};

type VideoInfo = { titre: string; plateforme: string; url: string };
type ProductType = {
  id: number;
  nom: string;
  categorie: string;
  prix: number;
  description: string;
  avantages?: string[];
  videos?: VideoInfo[];
  image: string;
};

const Product = () => {
  const { id } = useParams();
  const [allProducts, setAllProducts] = useState<ProductType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch("/data/products.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (isMounted) setAllProducts(json as ProductType[]);
      } catch (e: any) {
        if (isMounted) setLoadError(e?.message || "Erreur de chargement");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const product = useMemo(() => {
    return allProducts?.find((p) => p.id === Number(id));
  }, [allProducts, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Chargement du produit…</h1>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen pt-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Erreur</h1>
          <p className="text-muted-foreground mb-8">{loadError}</p>
          <Button asChild variant="hero">
            <Link to="/boutique">Retourner à la boutique</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Produit introuvable</h1>
          <p className="text-muted-foreground mb-8">Ce produit n'existe pas ou a été supprimé.</p>
          <Button asChild variant="hero">
            <Link to="/boutique">Retourner à la boutique</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link to="/boutique" className="flex items-center text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la boutique
            </Link>
          </Button>
        </div>

        {/* Product Layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image - Left Side */}
          <div className="space-y-4">
            <div className="fitness-card overflow-hidden">
              <img
                src={imageMap[product.image as keyof typeof imageMap]}
                alt={product.nom}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
            </div>
          </div>

          {/* Product Details - Right Side */}
          <div className="space-y-6">
            {/* Category Badge */}
            <Badge className="hero-gradient text-white border-0 text-sm">
              {product.categorie}
            </Badge>

            {/* Product Name */}
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              {product.nom}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-primary">
                {product.prix}€
              </span>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Description</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Avantages */}
            {product.avantages && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Avantages Clés</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.avantages.map((avantage, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{avantage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-6">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <ShoppingCart className="w-5 h-5 mr-3" />
                Ajouter au Panier - {product.prix}€
              </Button>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        {product.videos && product.videos.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="brand-text-gradient">Tutoriels & Démonstrations</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.videos.map((video, index) => (
                <Card key={index} className="fitness-card group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 hero-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-power">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">
                          {video.titre}
                        </h4>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {video.plateforme}
                          </Badge>
                          <Button asChild variant="ghost" size="sm">
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-primary hover:text-primary-glow"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Regarder
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Related Products or Community CTA */}
        <section className="text-center py-16 hero-gradient rounded-xl">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Rejoins la Communauté ActivShop Bénin
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Partage tes résultats, inspire les autres et forge ton héritage avec nous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="power" size="xl" className="bg-brand-black border-white/20">
              <Link to="/communaute">
                Rejoindre la Communauté
              </Link>
            </Button>
            <Button asChild variant="gold" size="xl">
              <Link to="/boutique">
                Découvrir Plus de Produits
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Product;