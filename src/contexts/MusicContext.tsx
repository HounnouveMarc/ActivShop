import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocalSong {
  id: number;
  title: string;
  artist: string;
  file: string;
  duration: string;
}

interface ExternalPlaylist {
  id: number;
  name: string;
  url: string;
  platform: string;
  icon: string;
}

interface PlaylistData {
  localSongs: LocalSong[];
  externalPlaylists: ExternalPlaylist[];
}

interface MusicContextType {
  // États de la musique
  isPlaying: boolean;
  currentSong: LocalSong | null;
  volume: number;
  isMuted: boolean;
  playlistData: PlaylistData | null;
  
  // États de l'interface
  showMusicWelcomeDialog: boolean;
  isMusicModalOpen: boolean;
  
  // Actions
  togglePlayPause: () => void;
  playSong: (song: LocalSong) => void;
  stopMusic: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setShowMusicWelcomeDialog: (show: boolean) => void;
  setIsMusicModalOpen: (open: boolean) => void;
  handleMusicWelcomeDialogClose: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider = ({ children }: MusicProviderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<LocalSong | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [showMusicWelcomeDialog, setShowMusicWelcomeDialog] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  // Charger la playlist au montage du composant
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const response = await fetch("/data/playlist.json");
        const data = await response.json();
        setPlaylistData(data);
      } catch (error) {
        console.error("Erreur lors du chargement de la playlist:", error);
      }
    };

    loadPlaylist();
  }, []);

  // Afficher la boîte de dialogue de musique au lancement
  useEffect(() => {
    const hasSeenMusicDialog = localStorage.getItem('hasSeenMusicDialog');
    if (!hasSeenMusicDialog) {
      setShowMusicWelcomeDialog(true);
    }
  }, []);

  // Sauvegarder l'état de la musique dans localStorage
  useEffect(() => {
    const musicState = {
      isPlaying,
      currentSong,
      volume,
      isMuted
    };
    localStorage.setItem('musicState', JSON.stringify(musicState));
  }, [isPlaying, currentSong, volume, isMuted]);

  // Restaurer l'état de la musique au chargement
  useEffect(() => {
    const savedState = localStorage.getItem('musicState');
    if (savedState) {
      try {
        const musicState = JSON.parse(savedState);
        if (musicState.currentSong) {
          setCurrentSong(musicState.currentSong);
        }
        setVolume(musicState.volume || 0.5);
        setIsMuted(musicState.isMuted || false);
        // Ne pas restaurer isPlaying automatiquement, laisser l'utilisateur décider
      } catch (error) {
        console.error("Erreur lors de la restauration de l'état de la musique:", error);
      }
    }
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playSong = (song: LocalSong) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const stopMusic = () => {
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleMusicWelcomeDialogClose = () => {
    setShowMusicWelcomeDialog(false);
    localStorage.setItem('hasSeenMusicDialog', 'true');
  };

  const value: MusicContextType = {
    isPlaying,
    currentSong,
    volume,
    isMuted,
    playlistData,
    showMusicWelcomeDialog,
    isMusicModalOpen,
    togglePlayPause,
    playSong,
    stopMusic,
    toggleMute,
    setVolume,
    setShowMusicWelcomeDialog,
    setIsMusicModalOpen,
    handleMusicWelcomeDialogClose
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
