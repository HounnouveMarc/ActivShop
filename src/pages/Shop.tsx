import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, ShoppingCart, Phone, X, Minus, Plus, MessageCircle, Facebook, Instagram, CheckCircle, AlertCircle } from "lucide-react";
import { simpleOrderService, type Order, type OrderItem } from "@/lib/simpleOrderService";
// Données produits chargées via fetch depuis public/data/products.json

// Import des images de produits
import creatineImage from "@/assets/creatine-product.jpg";
import jumpRopeImage from "@/assets/jump-rope-product.jpg";
import resistanceBandsImage from "@/assets/resistance-bands-product.jpg";

type ProductType = {
  id: number;
  nom: string;
  categorie: string;
  prix: number;
  description: string;
  image: string;
};

const imageMap = {
  "creatine-product.jpg": creatineImage,
  "jump-rope-product.jpg": jumpRopeImage,
  "resistance-bands-product.jpg": resistanceBandsImage,
};

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [allProducts, setAllProducts] = useState<ProductType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<{[key: number]: number}>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedContactMethod, setSelectedContactMethod] = useState("");
  const [clientInfo, setClientInfo] = useState({
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
    ville: ""
  });
  const [platformInfo, setPlatformInfo] = useState({
    whatsapp: "",
    facebook: "",
    instagram: ""
  });
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [orderSubmissionStatus, setOrderSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  // Référence au bouton panier du header pour détecter sa visibilité
  const headerCartRef = useRef<HTMLButtonElement | null>(null);
  // État d'affichage du bouton flottant (visible lorsque le panier du haut sort de l'écran)
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  // Position et drag du bouton flottant
  const floatingRef = useRef<HTMLButtonElement | null>(null);
  const dragDataRef = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number } | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const productsGridRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  // Charger le panier depuis localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("shop_cart_items");
      if (raw) {
        const parsed = JSON.parse(raw) as { [key: number]: number };
        setCartItems(parsed);
      }
    } catch {}
  }, []);

  // Sauvegarder le panier
  useEffect(() => {
    try {
      localStorage.setItem("shop_cart_items", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Charger les produits depuis public/data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/data/products.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (mounted) setAllProducts(json as ProductType[]);
      } catch (e: any) {
        if (mounted) setLoadError(e?.message || "Erreur de chargement");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Mapping entre les libellés affichés et les catégories présentes dans les données
  const categoryLabelToData: Record<string, string> = {
    "Nutrition & Énergie": "Compléments",
    "Matériel & Équipements": "Équipements",
    "Matos & Accessoires": "Vêtements",
  };

  // Mapping inverse pour afficher le bon libellé sur les badges des produits
  const dataCategoryToLabel: Record<string, string> = {
    "Compléments": "Nutrition & Énergie",
    "Équipements": "Matériel & Équipements",
    "Vêtements": "Matos & Accessoires",
  };

  const contactMethods = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      color: "from-green-600 to-emerald-600",
      hoverColor: "from-green-700 to-emerald-700",
      placeholder: "Numéro WhatsApp (ex: +221 77 123 45 67)",
      field: "whatsapp"
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "from-blue-600 to-indigo-600",
      hoverColor: "from-blue-700 to-indigo-700",
      placeholder: "Nom d'utilisateur Facebook ou lien profil",
      field: "facebook"
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "from-pink-600 to-purple-600",
      hoverColor: "from-pink-700 to-purple-700",
      placeholder: "Nom d'utilisateur Instagram (@username)",
      field: "instagram"
    }
  ];

  // Effets: focus search et ouverture du panier selon query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const focusParam = params.get("focus");
    const cartParam = params.get("cart");
    const searchParam = params.get("search");
    const categoryParam = params.get("category");
    if (focusParam === "search") {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
    if (cartParam === "open") {
      setIsCartOpen(true);
    }
    if (typeof searchParam === "string") {
      setSearchTerm(searchParam);
    }
    if (typeof categoryParam === "string") {
      // Accepter soit le libellé affiché, soit la valeur de données
      const labelFromData = Object.entries(dataCategoryToLabel).find(([dataKey, label]) => dataKey === categoryParam);
      const isLabel = Object.keys(categoryLabelToData).includes(categoryParam);
      if (isLabel) {
        setSelectedCategory(categoryParam);
      } else if (labelFromData) {
        setSelectedCategory(labelFromData[1]);
      } else if (categoryParam === "Tous") {
        setSelectedCategory("Tous");
      }
    }

    // Désactivé: ne pas auto-scroller sur refresh pour conserver l'en-tête visible
  }, [location.search]);

  // Fermer le panier lors d'un changement de route (ex: "Consulter les produits")
  useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname]);

  // Initialiser la position du bouton flottant (en bas à droite)
  useEffect(() => {
    if (floatingPos == null) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Taille approximative du bouton: 56x56
      setFloatingPos({ x: Math.max(16, vw - 80), y: Math.max(16, vh - 100) });
    }
  }, [floatingPos]);

  // Toujours afficher le bouton panier flottant
  useEffect(() => {
    setShowFloatingCart(true);
  }, []);

  // Handlers drag (mouse + touch)
  const onStartDrag = (clientX: number, clientY: number) => {
    if (!floatingRef.current) return;
    const rect = floatingRef.current.getBoundingClientRect();
    dragDataRef.current = { offsetX: clientX - rect.left, offsetY: clientY - rect.top };
  };
  const onMoveDrag = (clientX: number, clientY: number) => {
    if (!dragDataRef.current) return;
    const x = clientX - dragDataRef.current.offsetX;
    const y = clientY - dragDataRef.current.offsetY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = floatingRef.current?.offsetWidth ?? 64;
    const height = floatingRef.current?.offsetHeight ?? 64;
    // Contraindre dans l'écran
    const clampedX = Math.min(Math.max(8, x), vw - width - 8);
    const clampedY = Math.min(Math.max(8, y), vh - height - 8);
    setFloatingPos({ x: clampedX, y: clampedY });
  };
  const onEndDrag = () => {
    dragDataRef.current = null;
  };

  const addToCart = (productId: number) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    setToastMessage("Ajouté au panier");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cartItems).reduce((total, [productId, quantity]) => {
      const product = allProducts?.find(p => p.id === parseInt(productId));
      return total + (product?.prix || 0) * quantity;
    }, 0);
  };

  const getCartProducts = () => {
    return Object.entries(cartItems).map(([productId, quantity]) => {
      const product = allProducts?.find(p => p.id === parseInt(productId));
      return { product: product!, quantity };
    });
  };

  const handleContactSupplier = async () => {
    if (!selectedContactMethod) {
      setShowContactForm(true);
      return;
    }

    setIsSubmittingOrder(true);
    setOrderSubmissionStatus('idle');

    try {
      // Préparer les données de la commande
      const cartProducts = getCartProducts();
      const orderItems: OrderItem[] = cartProducts.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
        productName: product.nom,
        unitPrice: product.prix,
        totalPrice: product.prix * quantity
      }));

      const orderData = {
        clientInfo,
        platformInfo,
        contactMethod: selectedContactMethod,
        items: orderItems,
        totalAmount: getTotalPrice(),
        message: `Commande de ${clientInfo.nom} via ${selectedContactMethod}`
      };

      // Sauvegarder la commande
      const savedOrder = await simpleOrderService.saveOrder(orderData);
      setSubmittedOrder(savedOrder);
      setOrderSubmissionStatus('success');

      // Afficher un message de succès
      setToastMessage(`Commande ${savedOrder.id} soumise avec succès !`);
      setShowToast(true);

      // Ouvrir la plateforme externe après un délai
      setTimeout(() => {
        simpleOrderService.sendOrderToPlatform(savedOrder);
      }, 1500);

      // Réinitialiser le formulaire
      setTimeout(() => {
        setShowContactForm(false);
        setSelectedContactMethod("");
        setClientInfo({ nom: "", telephone: "", email: "", adresse: "", ville: "" });
        setPlatformInfo({ whatsapp: "", facebook: "", instagram: "" });
        setOrderSubmissionStatus('idle');
        setSubmittedOrder(null);
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de la soumission de la commande:', error);
      setOrderSubmissionStatus('error');
      setToastMessage("Erreur lors de la soumission de la commande. Veuillez réessayer.");
      setShowToast(true);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const categories = ["Tous", "Nutrition & Énergie", "Matériel & Équipements", "Matos & Accessoires"];

  const filteredProducts = useMemo(() => {
    return (allProducts ?? []).filter((product) => {
      const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "Tous" 
        ? true 
        : product.categorie === categoryLabelToData[selectedCategory];
      
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchTerm, selectedCategory]);

  // Intersection Observer pour les animations d'apparition
  useEffect(() => {
    const root = containerRef.current ?? undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("reveal-visible");
            observer.unobserve(target);
          }
        });
      },
      {
        root,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1,
      }
    );

    const nodes = containerRef.current?.querySelectorAll<HTMLElement>(".reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right") ?? [];
    nodes.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-card" ref={containerRef}>
        <div className="container mx-auto px-4 py-8">
          {/* Header - Affiché immédiatement */}
          <div className="text-center mb-12 reveal-up">
            <div className="flex justify-between items-center mb-8 reveal">
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="brand-text-gradient">Boutique ActivShop Bénin</span>
              </h1>
              
              {/* Panier Dialog */}
              <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DialogTrigger asChild>
                  <Button ref={headerCartRef} variant="outline" className="relative bg-card border-border text-foreground hover:bg-muted">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Panier
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">Mon Panier</DialogTitle>
                  </DialogHeader>
                  
                  {getTotalItems() === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">Votre panier est vide</p>
                      <Button asChild variant="hero">
                        <Link to="/boutique">Consulter les produits</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Message personnalisé */}
                      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-primary mb-2">Message de commande :</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Bonjour, je souhaite commander les produits suivants :
                        </p>
                      </div>

                      {/* Liste des produits */}
                      <div className="space-y-3">
                        {getCartProducts().map(({ product, quantity }) => (
                          <div key={product.id} className="flex items-center gap-4 p-4 bg-muted/50 border border-border rounded-lg">
                            <img
                              src={imageMap[product.image as keyof typeof imageMap]}
                              alt={product.nom}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{product.nom}</h3>
                              <p className="text-sm text-muted-foreground">Prix unitaire : {product.prix.toLocaleString()} FCFA</p>
                              <p className="text-sm text-muted-foreground">Quantité : {quantity}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(product.id)}
                                className="bg-card border-border text-foreground hover:bg-muted"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center text-foreground font-semibold">{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addToCart(product.id)}
                                className="bg-card border-border text-foreground hover:bg-muted"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-secondary">
                                {(product.prix * quantity).toLocaleString()} FCFA
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Total et bouton de contact */}
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-xl font-bold text-foreground">Total de la commande :</span>
                          <span className="text-2xl font-bold text-secondary">
                            {getTotalPrice().toLocaleString()} FCFA
                          </span>
                        </div>
                        
                        {/* Bouton de contact fournisseur amélioré */}
                        <div className="space-y-3">
                          {!showContactForm ? (
                            <Button 
                              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 text-lg" 
                              size="lg"
                              onClick={() => setShowContactForm(true)}
                            >
                              <Phone className="w-5 h-5 mr-3" />
                              Contacter le fournisseur pour finaliser l'achat
                            </Button>
                          ) : (
                            <div className="space-y-4">
                              {/* Sélection du moyen de contact */}
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Choisissez votre moyen de contact :</h4>
                                <div className="grid grid-cols-3 gap-3">
                                  {contactMethods.map((method) => (
                                    <Button
                                      key={method.id}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedContactMethod(method.id)}
                                      className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                                        selectedContactMethod === method.id 
                                          ? `bg-gradient-to-r ${method.color} text-white border-0` 
                                          : "bg-card border-border text-foreground hover:bg-muted"
                                      }`}
                                    >
                                        {(() => {
                                        const IconComponent = method.icon;
                                        return <IconComponent className="w-6 h-6" />;
                                      })()}
                                      <span className="text-xs font-medium">{method.name}</span>
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              {/* Formulaire d'informations client */}
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Vos informations de contact :</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Nom complet"
                                    value={clientInfo.nom}
                                    onChange={(e) => setClientInfo(prev => ({ ...prev, nom: e.target.value }))}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                  <Input
                                    placeholder="Téléphone"
                                    value={clientInfo.telephone}
                                    onChange={(e) => setClientInfo(prev => ({ ...prev, telephone: e.target.value }))}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                  <Input
                                    placeholder="Email (optionnel)"
                                    value={clientInfo.email}
                                    onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                  <Input
                                    placeholder="Ville"
                                    value={clientInfo.ville}
                                    onChange={(e) => setClientInfo(prev => ({ ...prev, ville: e.target.value }))}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                </div>
                                <Input
                                  placeholder="Adresse complète"
                                  value={clientInfo.adresse}
                                  onChange={(e) => setClientInfo(prev => ({ ...prev, adresse: e.target.value }))}
                                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted mt-3"
                                />
                              </div>

                              {/* Informations de la plateforme choisie */}
                              {selectedContactMethod && (
                                <div>
                                  <h4 className="font-semibold text-foreground mb-3">
                                    Vos informations {contactMethods.find(m => m.id === selectedContactMethod)?.name} :
                                  </h4>
                                  <Input
                                    placeholder={contactMethods.find(m => m.id === selectedContactMethod)?.placeholder || ""}
                                    value={platformInfo[contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo] || ""}
                                    onChange={(e) => {
                                      const field = contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo;
                                      if (field) {
                                        setPlatformInfo(prev => ({ ...prev, [field]: e.target.value }));
                                      }
                                    }}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Ces informations permettront au fournisseur de vous relancer sur {contactMethods.find(m => m.id === selectedContactMethod)?.name}
                                  </p>
                                </div>
                              )}

                              {/* Bouton d'envoi */}
                              <Button 
                                className={`w-full font-semibold py-3 text-lg ${
                                  selectedContactMethod && clientInfo.nom && clientInfo.telephone && clientInfo.ville && platformInfo[contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo]
                                    ? `bg-gradient-to-r ${contactMethods.find(m => m.id === selectedContactMethod)?.color} hover:${contactMethods.find(m => m.id === selectedContactMethod)?.hoverColor} text-white`
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                                }`}
                                size="lg"
                                onClick={handleContactSupplier}
                                disabled={!selectedContactMethod || !clientInfo.nom || !clientInfo.telephone || !clientInfo.ville || !platformInfo[contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo]}
                              >
                                <Phone className="w-5 h-5 mr-3" />
                                Envoyer ma commande via {selectedContactMethod ? contactMethods.find(m => m.id === selectedContactMethod)?.name : "..."}
                              </Button>

                              {/* Bouton retour */}
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setShowContactForm(false);
                                  setSelectedContactMethod("");
                                  setClientInfo({ nom: "", telephone: "", email: "", adresse: "", ville: "" });
                                  setPlatformInfo({ whatsapp: "", facebook: "", instagram: "" });
                                }}
                                className="w-full bg-card border-border text-foreground hover:bg-muted"
                              >
                                ← Retour au panier
                              </Button>
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground text-center">
                            📱 Commande via WhatsApp • 🚚 Livraison rapide • 💳 Paiement sécurisé
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Phrase d'accueil personnalisée et percutante */}
            <div className="max-w-4xl mx-auto mb-8 reveal">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">
                <span className="text-secondary">Équipe-toi</span> avec les meilleurs produits pour 
                <span className="text-primary"> atteindre tes objectifs</span> et 
                <span className="text-secondary"> forger ton héritage</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Ici, chaque produit est choisi pour sa qualité exceptionnelle et sa capacité à transformer ton potentiel en réalité. 
                Ce n'est pas du shopping, c'est de l'investissement dans ton avenir.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 reveal-up">
            {/* Search */}
            <div className="relative flex-1 reveal">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchInputRef}
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap reveal">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "force" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "" : "bg-card border-border text-foreground hover:bg-muted"}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Chargement des produits…</h3>
            <p className="text-muted-foreground">Veuillez patienter pendant que nous récupérons nos produits.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen pt-20 bg-card" ref={containerRef}>
        <div className="container mx-auto px-4 py-8">
          {/* Header - Affiché même en cas d'erreur */}
          <div className="text-center mb-12 reveal-up">
            <div className="flex justify-between items-center mb-8 reveal">
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="brand-text-gradient">Boutique ActivShop Bénin</span>
              </h1>
              
              {/* Panier Dialog */}
              <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DialogTrigger asChild>
                  <Button ref={headerCartRef} variant="outline" className="relative bg-card border-border text-foreground hover:bg-muted">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Panier
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">Mon Panier</DialogTitle>
                  </DialogHeader>
                  
                  {getTotalItems() === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">Votre panier est vide</p>
                      <Button asChild variant="hero">
                        <Link to="/boutique">Consulter les produits</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Message personnalisé */}
                      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-primary mb-2">Message de commande :</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Bonjour, je souhaite commander les produits suivants :
                        </p>
                      </div>

                      {/* Liste des produits */}
                      <div className="space-y-3">
                        {getCartProducts().map(({ product, quantity }) => (
                          <div key={product.id} className="flex items-center gap-4 p-4 bg-muted/50 border border-border rounded-lg">
                            <img
                              src={imageMap[product.image as keyof typeof imageMap]}
                              alt={product.nom}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{product.nom}</h3>
                              <p className="text-sm text-muted-foreground">Prix unitaire : {product.prix.toLocaleString()} FCFA</p>
                              <p className="text-sm text-muted-foreground">Quantité : {quantity}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(product.id)}
                                className="bg-card border-border text-foreground hover:bg-muted"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center text-foreground font-semibold">{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addToCart(product.id)}
                                className="bg-card border-border text-foreground hover:bg-muted"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-secondary">
                                {(product.prix * quantity).toLocaleString()} FCFA
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Total et bouton de contact */}
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-xl font-bold text-foreground">Total de la commande :</span>
                          <span className="text-2xl font-bold text-secondary">
                            {getTotalPrice().toLocaleString()} FCFA
                          </span>
                        </div>
                        
                        {/* Bouton de contact fournisseur amélioré */}
                        <div className="space-y-3">
                          {!showContactForm ? (
                            <Button 
                              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 text-lg" 
                              size="lg"
                              onClick={() => setShowContactForm(true)}
                            >
                              <Phone className="w-5 h-5 mr-3" />
                              Contacter le fournisseur pour finaliser l'achat
                            </Button>
                          ) : (
                            <div className="space-y-4">
                              {/* Sélection du moyen de contact */}
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Choisissez votre moyen de contact :</h4>
                                <div className="grid grid-cols-3 gap-3">
                                  {contactMethods.map((method) => (
                                    <Button
                                      key={method.id}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedContactMethod(method.id)}
                                      className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                                        selectedContactMethod === method.id 
                                          ? `bg-gradient-to-r ${method.color} text-white border-0` 
                                          : "bg-card border-border text-foreground hover:bg-muted"
                                      }`}
                                    >
                                        {(() => {
                                        const IconComponent = method.icon;
                                        return <IconComponent className="w-6 h-6" />;
                                      })()}
                                      <span className="text-xs font-medium">{method.name}</span>
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              {/* Formulaire d'informations client */}
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Vos informations de contact :</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <Input
                                    placeholder="Nom complet"
                                    value={clientInfo.nom}
                                    onChange={(e) => setClientInfo(prev => ({ ...prev, nom: e.target.value }))}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                  <Input
                                    placeholder="Téléphone"
                                    value={clientInfo.telephone}
                                    onChange={(e) => setClientInfo(prev => ({ ...prev, telephone: e.target.value }))}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                  <Input
                                    placeholder="Email (optionnel)"
                                    value={clientInfo.email}
                                    onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                  <Input
                                    placeholder="Ville"
                                    value={clientInfo.ville}
                                    onChange={(e) => setClientInfo(prev => ({ ...prev, ville: e.target.value }))}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                </div>
                                <Input
                                  placeholder="Adresse complète"
                                  value={clientInfo.adresse}
                                  onChange={(e) => setClientInfo(prev => ({ ...prev, adresse: e.target.value }))}
                                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted mt-3"
                                />
                              </div>

                              {/* Informations de la plateforme choisie */}
                              {selectedContactMethod && (
                                <div>
                                  <h4 className="font-semibold text-foreground mb-3">
                                    Vos informations {contactMethods.find(m => m.id === selectedContactMethod)?.name} :
                                  </h4>
                                  <Input
                                    placeholder={contactMethods.find(m => m.id === selectedContactMethod)?.placeholder || ""}
                                    value={platformInfo[contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo] || ""}
                                    onChange={(e) => {
                                      const field = contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo;
                                      if (field) {
                                        setPlatformInfo(prev => ({ ...prev, [field]: e.target.value }));
                                      }
                                    }}
                                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                  />
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Ces informations permettront au fournisseur de vous relancer sur {contactMethods.find(m => m.id === selectedContactMethod)?.name}
                                  </p>
                                </div>
                              )}

                              {/* Bouton d'envoi */}
                              <Button 
                                className={`w-full font-semibold py-3 text-lg ${
                                  selectedContactMethod && clientInfo.nom && clientInfo.telephone && clientInfo.ville && platformInfo[contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo]
                                    ? `bg-gradient-to-r ${contactMethods.find(m => m.id === selectedContactMethod)?.color} hover:${contactMethods.find(m => m.id === selectedContactMethod)?.hoverColor} text-white`
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                                }`}
                                size="lg"
                                onClick={handleContactSupplier}
                                disabled={!selectedContactMethod || !clientInfo.nom || !clientInfo.telephone || !clientInfo.ville || !platformInfo[contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo]}
                              >
                                <Phone className="w-5 h-5 mr-3" />
                                Envoyer ma commande via {selectedContactMethod ? contactMethods.find(m => m.id === selectedContactMethod)?.name : "..."}
                              </Button>

                              {/* Bouton retour */}
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setShowContactForm(false);
                                  setSelectedContactMethod("");
                                  setClientInfo({ nom: "", telephone: "", email: "", adresse: "", ville: "" });
                                  setPlatformInfo({ whatsapp: "", facebook: "", instagram: "" });
                                }}
                                className="w-full bg-card border-border text-foreground hover:bg-muted"
                              >
                                ← Retour au panier
                              </Button>
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground text-center">
                            📱 Commande via WhatsApp • 🚚 Livraison rapide • 💳 Paiement sécurisé
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Phrase d'accueil personnalisée et percutante */}
            <div className="max-w-4xl mx-auto mb-8 reveal">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">
                <span className="text-secondary">Équipe-toi</span> avec les meilleurs produits pour 
                <span className="text-primary"> atteindre tes objectifs</span> et 
                <span className="text-secondary"> forger ton héritage</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Ici, chaque produit est choisi pour sa qualité exceptionnelle et sa capacité à transformer ton potentiel en réalité. 
                Ce n'est pas du shopping, c'est de l'investissement dans ton avenir.
              </p>
            </div>
          </div>

          {/* Error State */}
          <div className="text-center py-16">
            <h3 className="text-3xl font-bold mb-4 text-foreground">Erreur</h3>
          <p className="text-muted-foreground mb-8">{loadError}</p>
          <Button asChild variant="hero">
            <Link to="/">Revenir à l'accueil</Link>
          </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen pt-20 bg-card" ref={containerRef}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 reveal-up">
          <div className="flex justify-between items-center mb-8 reveal">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="brand-text-gradient">Boutique ActivShop Bénin</span>
            </h1>
            
            {/* Panier Dialog */}
            <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DialogTrigger asChild>
                <Button ref={headerCartRef} variant="outline" className="relative bg-card border-border text-foreground hover:bg-muted">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Panier
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">Mon Panier</DialogTitle>
                </DialogHeader>
                
                {getTotalItems() === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Votre panier est vide</p>
                    <Button asChild variant="hero">
                      <Link to="/boutique">Consulter les produits</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Message personnalisé */}
                    <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-primary mb-2">Message de commande :</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Bonjour, je souhaite commander les produits suivants :
                      </p>
                    </div>

                    {/* Liste des produits */}
                    <div className="space-y-3">
                      {getCartProducts().map(({ product, quantity }) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 bg-muted/50 border border-border rounded-lg">
                          <img
                            src={imageMap[product.image as keyof typeof imageMap]}
                            alt={product.nom}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{product.nom}</h3>
                            <p className="text-sm text-muted-foreground">Prix unitaire : {product.prix.toLocaleString()} FCFA</p>
                            <p className="text-sm text-muted-foreground">Quantité : {quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(product.id)}
                              className="bg-card border-border text-foreground hover:bg-muted"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center text-foreground font-semibold">{quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addToCart(product.id)}
                              className="bg-card border-border text-foreground hover:bg-muted"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-secondary">
                              {(product.prix * quantity).toLocaleString()} FCFA
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total et bouton de contact */}
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold text-foreground">Total de la commande :</span>
                        <span className="text-2xl font-bold text-secondary">
                          {getTotalPrice().toLocaleString()} FCFA
                        </span>
                      </div>
                      
                      {/* Bouton de contact fournisseur amélioré */}
                      <div className="space-y-3">
                        {!showContactForm ? (
                          <Button 
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 text-lg" 
                            size="lg"
                            onClick={() => setShowContactForm(true)}
                          >
                            <Phone className="w-5 h-5 mr-3" />
                            Contacter le fournisseur pour finaliser l'achat
                          </Button>
                        ) : (
                          <div className="space-y-4">
                            {/* Sélection du moyen de contact */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">Choisissez votre moyen de contact :</h4>
                              <div className="grid grid-cols-3 gap-3">
                                {contactMethods.map((method) => (
                                  <Button
                                    key={method.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedContactMethod(method.id)}
                                    className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                                      selectedContactMethod === method.id 
                                        ? `bg-gradient-to-r ${method.color} text-white border-0` 
                                        : "bg-card border-border text-foreground hover:bg-muted"
                                    }`}
                                  >
                                      {(() => {
                                      const IconComponent = method.icon;
                                      return <IconComponent className="w-6 h-6" />;
                                    })()}
                                    <span className="text-xs font-medium">{method.name}</span>
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Formulaire d'informations client */}
                            <div>
                              <h4 className="font-semibold text-foreground mb-3">Vos informations de contact :</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                  placeholder="Nom complet"
                                  value={clientInfo.nom}
                                  onChange={(e) => setClientInfo(prev => ({ ...prev, nom: e.target.value }))}
                                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                />
                                <Input
                                  placeholder="Téléphone"
                                  value={clientInfo.telephone}
                                  onChange={(e) => setClientInfo(prev => ({ ...prev, telephone: e.target.value }))}
                                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                />
                                <Input
                                  placeholder="Email (optionnel)"
                                  value={clientInfo.email}
                                  onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                />
                                <Input
                                  placeholder="Ville"
                                  value={clientInfo.ville}
                                  onChange={(e) => setClientInfo(prev => ({ ...prev, ville: e.target.value }))}
                                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                />
                              </div>
                              <Input
                                placeholder="Adresse complète"
                                value={clientInfo.adresse}
                                onChange={(e) => setClientInfo(prev => ({ ...prev, adresse: e.target.value }))}
                                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted mt-3"
                              />
                            </div>

                            {/* Informations de la plateforme choisie */}
                            {selectedContactMethod && (
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">
                                  Vos informations {contactMethods.find(m => m.id === selectedContactMethod)?.name} :
                                </h4>
                                <Input
                                  placeholder={contactMethods.find(m => m.id === selectedContactMethod)?.placeholder || ""}
                                  value={platformInfo[contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo] || ""}
                                  onChange={(e) => {
                                    const field = contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo;
                                    if (field) {
                                      setPlatformInfo(prev => ({ ...prev, [field]: e.target.value }));
                                    }
                                  }}
                                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                  Ces informations permettront au fournisseur de vous relancer sur {contactMethods.find(m => m.id === selectedContactMethod)?.name}
                                </p>
                              </div>
                            )}

                            {/* Bouton d'envoi */}
                            <Button 
                              className={`w-full font-semibold py-3 text-lg ${
                                selectedContactMethod && clientInfo.nom && clientInfo.telephone && clientInfo.ville && platformInfo[contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo]
                                  ? `bg-gradient-to-r ${contactMethods.find(m => m.id === selectedContactMethod)?.color} hover:${contactMethods.find(m => m.id === selectedContactMethod)?.hoverColor} text-white`
                                  : "bg-muted text-muted-foreground cursor-not-allowed"
                              }`}
                              size="lg"
                              onClick={handleContactSupplier}
                              disabled={!selectedContactMethod || !clientInfo.nom || !clientInfo.telephone || !clientInfo.ville || !platformInfo[contactMethods.find(m => m.id === selectedContactMethod)?.field as keyof typeof platformInfo]}
                            >
                              <Phone className="w-5 h-5 mr-3" />
                              Envoyer ma commande via {selectedContactMethod ? contactMethods.find(m => m.id === selectedContactMethod)?.name : "..."}
                            </Button>

                            {/* Bouton retour */}
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowContactForm(false);
                                setSelectedContactMethod("");
                                setClientInfo({ nom: "", telephone: "", email: "", adresse: "", ville: "" });
                                setPlatformInfo({ whatsapp: "", facebook: "", instagram: "" });
                              }}
                              className="w-full bg-card border-border text-foreground hover:bg-muted"
                            >
                              ← Retour au panier
                            </Button>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground text-center">
                          📱 Commande via WhatsApp • 🚚 Livraison rapide • 💳 Paiement sécurisé
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Phrase d'accueil personnalisée et percutante */}
          <div className="max-w-4xl mx-auto mb-8 reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">
              <span className="text-secondary">Équipe-toi</span> avec les meilleurs produits pour 
              <span className="text-primary"> atteindre tes objectifs</span> et 
              <span className="text-secondary"> forger ton héritage</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Ici, chaque produit est choisi pour sa qualité exceptionnelle et sa capacité à transformer ton potentiel en réalité. 
              Ce n'est pas du shopping, c'est de l'investissement dans ton avenir.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 reveal-up">
          {/* Search */}
          <div className="relative flex-1 reveal">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              ref={searchInputRef}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap reveal">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "force" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "" : "bg-card border-border text-foreground hover:bg-muted"}
              >
                <Filter className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div ref={productsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              className="group rounded-lg overflow-hidden transition-power hover:card-shadow hover:-translate-y-1 bg-muted border border-border reveal-up"
              style={{ transitionDelay: `${Math.min(idx, 8) * 60}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={imageMap[product.image as keyof typeof imageMap]}
                  alt={product.nom}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-power"
                />
                <Badge className="absolute top-4 left-4 bg-[#FF7A00] text-white border-0">
                  {dataCategoryToLabel[product.categorie] ?? product.categorie}
                </Badge>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {product.nom}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-secondary">
                      {product.prix.toLocaleString()} FCFA
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => addToCart(product.id)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                    <Button asChild variant="hero" size="sm">
                      <Link to={`/produit/${product.id}`}>
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Aucun produit trouvé
            </h3>
            <p className="text-muted-foreground mb-8">
              Essayez de modifier vos filtres ou votre recherche.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tous");
              }}
              className="bg-card border-border text-foreground hover:bg-muted"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Bouton panier flottant (visible quand le panier du haut n'est plus visible) */}
      {showFloatingCart && floatingPos && (
        <button
          ref={floatingRef}
          onMouseDown={(e) => {
            e.preventDefault();
            const move = (ev: MouseEvent) => onMoveDrag(ev.clientX, ev.clientY);
            const up = () => {
              window.removeEventListener('mousemove', move);
              window.removeEventListener('mouseup', up);
              onEndDrag();
            };
            onStartDrag(e.clientX, e.clientY);
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', up);
          }}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            if (!touch) return;
            const move = (ev: TouchEvent) => {
              const t = ev.touches[0];
              if (!t) return;
              onMoveDrag(t.clientX, t.clientY);
            };
            const end = () => {
              window.removeEventListener('touchmove', move);
              window.removeEventListener('touchend', end);
              onEndDrag();
            };
            onStartDrag(touch.clientX, touch.clientY);
            window.addEventListener('touchmove', move, { passive: false });
            window.addEventListener('touchend', end);
          }}
          onClick={() => setIsCartOpen(true)}
          className="fixed z-50 shadow-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none"
          style={{ left: `${floatingPos.x}px`, top: `${floatingPos.y}px`, width: 56, height: 56 }}
          aria-label="Ouvrir le panier"
        >
          <span className="relative inline-flex items-center justify-center w-full h-full">
            <ShoppingCart className="w-5 h-5" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </span>
        </button>
      )}
    </div>
    {showToast && (
      <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50">
        {toastMessage}
      </div>
    )}
    </>
  );
};

export default Shop;