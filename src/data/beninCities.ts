// Dictionnaire des villes du Bénin
// À compléter avec la liste complète des 63 villes

export const BENIN_CITIES = [
  // Villes principales (à afficher en priorité)
  "Cotonou",
  "Porto-Novo", 
  "Parakou",
  "Djougou",
  "Bohicon",
  "Abomey",
  "Natitingou",
  
  // Autres villes (à compléter avec la liste complète)
  "Kandi",
  "Lokossa",
  "Ouidah",
  "Abomey-Calavi",
  "Savalou",
  "Sakété",
  "Comé",
  "Bassila",
  "Banikoara",
  "Kérou",
  "Tchaourou",
  "Dassa-Zoumé",
  "Covè",
  "Aplahoué",
  "Dogbo",
  "Klouékanmè",
  "Lalo",
  "Toviklin",
  "Bopa",
  "Grand-Popo",
  "Houéyogbé",
  "Kpomassè",
  "Mono",
  "Athieme",
  "Bopa",
  "Comé",
  "Grand-Popo",
  "Houéyogbé",
  "Kpomassè",
  "Lokossa",
  "Mono",
  "Toviklin",
  "Bassila",
  "Copargo",
  "Djougou",
  "Ouaké",
  "Bembèrèkè",
  "Kalalé",
  "N'Dali",
  "Nikki",
  "Pèrèrè",
  "Sinendé",
  "Tchaourou",
  "Bantè",
  "Dassa-Zoumé",
  "Glazoué",
  "Ouèssè",
  "Savalou",
  "Savè",
  "Aguégués",
  "Akpro-Missérété",
  "Avrankou",
  "Bonou",
  "Dangbo",
  "Porto-Novo",
  "Sèmè-Kpodji",
  "Adjarra",
  "Adjohoun",
  "Aguégués",
  "Akpro-Missérété",
  "Avrankou",
  "Bonou",
  "Dangbo",
  "Porto-Novo",
  "Sèmè-Kpodji"
];

// Fonction pour obtenir les suggestions de villes basées sur une recherche
export const getCitySuggestions = (searchTerm: string): string[] => {
  if (!searchTerm || searchTerm.length < 2) {
    return BENIN_CITIES.slice(0, 7); // Afficher les 7 premières villes par défaut
  }
  
  const filtered = BENIN_CITIES.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return filtered.slice(0, 10); // Limiter à 10 suggestions
};

// Fonction pour obtenir les villes principales (pour la liste déroulante)
export const getMainCities = (): string[] => {
  return BENIN_CITIES.slice(0, 7);
};
