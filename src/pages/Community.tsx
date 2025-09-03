import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// Données déplacées vers public/data et chargées via fetch
import { 
  Hash, 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Flame,
  Users,
  Target,
  Instagram,
  Facebook,
  Video,
  Send
} from "lucide-react";

type Challenge = {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO
};

const Community = () => {
  type Hashtag = { tag: string; posts: number; route: string };
  const [hashtagsConfig, setHashtagsConfig] = useState<Hashtag[]>([]);
  const [challengesData, setChallengesData] = useState<Challenge[]>([]);
  const navigate = useNavigate();

  const navigateToHashtag = (tag: string) => {
    const match = hashtagsConfig.find((h) => h.tag === tag);
    const route = match?.route || `/communaute?tag=${encodeURIComponent(tag.replace(/^#/, ""))}`;
    navigate(route);
  };
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [hRes, cRes] = await Promise.all([
          fetch("/data/hashtags.json", { cache: "no-store" }),
          fetch("/data/challenges.json", { cache: "no-store" })
        ]);
        const [hJson, cJson] = await Promise.all([hRes.json(), cRes.json()]);
        if (mounted) {
          setHashtagsConfig(hJson as Hashtag[]);
          setChallengesData(cJson as Challenge[]);
        }
      } catch {}
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const challengesWithRemaining = useMemo(() => {
    return challengesData.map((c) => {
      const deadlineMs = new Date(c.deadline).getTime();
      const remainingMs = Math.max(0, deadlineMs - now);
      return { ...c, remainingMs };
    });
  }, [challengesData, now]);

  const formatRemaining = (ms: number) => {
    if (ms <= 0) return "Terminé";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${days}j ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  };
  const hashtags = [
    { tag: "#ActivShopBenin", posts: 1547 },
    { tag: "#ToutLeFitness", posts: 892 },
    { tag: "#UnSeulMarche", posts: 634 },
    { tag: "#FitnessElite", posts: 1203 },
    { tag: "#TransformationFitness", posts: 756 },
    { tag: "#CommunauteFitness", posts: 445 }
  ];

  const [postContent, setPostContent] = useState<string>("");
  const [showShareButtons, setShowShareButtons] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  const openLink = (url: string) => window.open(url, "_blank");
  const instagramUrl = "https://www.instagram.com/activshop_bj";
  const tiktokUrl = "https://www.tiktok.com/@activshop_bj?is_from_webapp=1&sender_device=pc";
  const facebookUrl = "https://www.facebook.com/profile.php?id=61580351392853";
  const whatsappNeedsOrdersUrl = "https://chat.whatsapp.com/BioTSrCToEn4CMqkZpD70N?mode=ems_share_t";
  const whatsappVipUrl = "https://chat.whatsapp.com/EYar6o2zNIf57lncjQAadD?mode=ems_share_t";
  const whatsappCommunityUrl = "https://chat.whatsapp.com/EbFc7zY7zBHAqFn2BImKuL";

  // (likes désactivés tant que les posts communautaires sont masqués)

  const handlePublish = async () => {
    const content = postContent.trim();
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setToastMessage("Contenu copié. Choisis une plateforme pour publier.");
    } catch {
      setToastMessage("Copie auto impossible. Copie manuelle requise.");
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setShowShareButtons(true);
  };

  // (actions likes/partage par post désactivées pour l'instant)

  return (
    <>
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="brand-text-gradient">Communauté ActivShop Bénin</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Unis par la même passion pour l'excellence. Partage ton parcours, inspire les autres et forge ton héritage.
          </p>
        </div>

        {/* Défis du moment - En haut */}
        <div className="mb-12">
          <Card className="fitness-card hero-gradient max-w-4xl mx-auto border-0">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-6 text-white" />
              <h2 className="text-3xl font-bold mb-4 text-white">
                Défis du moment
              </h2>
              <p className="text-white/90 mb-6 text-lg max-w-2xl mx-auto">
                Participe aux défis communautaires et gagne des produits exclusifs ! 
                Dépasse tes limites avec la communauté ActivShop Bénin.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {challengesWithRemaining.map((c) => (
                  <div key={c.id} className="bg-white/10 rounded-lg p-4">
                    <h3 className="font-bold text-white mb-1">{c.title}</h3>
                    <p className="text-white/80 text-sm mb-2">{c.description}</p>
                    <p className="text-white text-sm font-semibold">Temps restant : {formatRemaining(c.remainingMs)}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="power"
                size="lg"
                className="bg-brand-black border-white/20"
                onClick={() => window.open("https://chat.whatsapp.com/EYar6o2zNIf57lncjQAadD?mode=ems_share_t", "_blank")}
              >
                Rejoindre les Défis
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Feed */}
          <div className="space-y-6">
            {/* Create Post */}
            <Card className="fitness-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  Partage ton expérience ActivShop Bénin
                </h3>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Raconte-nous ta transformation, tes objectifs, tes victoires..."
                    className="min-h-24 bg-card border-border text-foreground placeholder:text-muted-foreground focus:bg-muted"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    {hashtagsConfig.slice(0, 3).map((hashtag) => (
                      <Badge
                        key={hashtag.tag}
                        onClick={() => navigateToHashtag(hashtag.tag)}
                        variant="outline"
                        className="cursor-pointer hover:hero-gradient hover:text-white transition-power bg-card border-border text-foreground"
                      >
                        {hashtag.tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {showShareButtons && (
                        <>
                          <Button variant="ghost" size="sm" className="bg-card text-foreground hover:bg-muted" onClick={() => openLink(instagramUrl)}>
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </Button>
                          <Button variant="ghost" size="sm" className="bg-card text-foreground hover:bg-muted" onClick={() => openLink(tiktokUrl)}>
                            <Video className="w-4 h-4 mr-2" />
                            TikTok
                          </Button>
                          <Button variant="ghost" size="sm" className="bg-card text-foreground hover:bg-muted" onClick={() => openLink(facebookUrl)}>
                            <Facebook className="w-4 h-4 mr-2" />
                            Facebook
                      </Button>
                        </>
                      )}
                    </div>
                    <Button variant="hero" size="sm" onClick={handlePublish}>
                      <Send className="w-4 h-4 mr-2" />
                      Publier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Posts (désactivé pour l'instant) */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Grille sidebar: Code d'Honneur à gauche, Hashtags à droite */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Community Guidelines */}
              <Card className="fitness-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-foreground">Code d'Honneur</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Respecte et inspire tes frères et sœurs de force</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Partage tes vrais résultats et expériences</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Soutiens les débutants dans leur parcours</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Forge ton héritage avec intégrité</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Hashtags */}
              <Card className="fitness-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center text-foreground">
                    <Hash className="w-5 h-5 mr-2 text-primary" />
                    Hashtags Populaires
                  </h3>
                  <div className="space-y-3">
                    {hashtagsConfig.map((hashtag, index: number) => (
                      <div key={hashtag.tag} onClick={() => navigateToHashtag(hashtag.tag)} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {hashtag.tag}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {hashtag.posts.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* WhatsApp - Vos besoins et commandes */}
            <Card className="fitness-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Vos besoins et commandes
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" variant="outline" onClick={() => window.open(whatsappNeedsOrdersUrl, "_blank")}>
                    Ouvrir le groupe Vos besoins et commandes
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => window.open(whatsappVipUrl, "_blank")}>
                    Ouvrir le groupe VIP Zone
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rejoindre la communauté */}
            <Card className="fitness-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Rejoindre la communauté
                </h3>
                <Button variant="hero" className="w-full" onClick={() => window.open(whatsappCommunityUrl, "_blank")}>
                  Rejoindre la communauté sur WhatsApp
                </Button>
              </CardContent>
            </Card>
            

          </div>
        </div>
      </div>
    </div>
    {showToast && (
      <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50">
        {toastMessage}
      </div>
    )}
    </>
  );
};

export default Community;