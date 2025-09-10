import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Pause, Volume2, VolumeX, Download, ExternalLink, Music } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";

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

const MusicPlayer = () => {
  const {
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
    setIsMusicModalOpen,
    handleMusicWelcomeDialogClose
  } = useMusic();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gérer la lecture audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Gérer la lecture/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleWelcomeAccept = () => {
    handleMusicWelcomeDialogClose();
    if (playlistData?.localSongs.length > 0) {
      playSong(playlistData.localSongs[0]);
    }
  };

  const handleWelcomeDecline = () => {
    handleMusicWelcomeDialogClose();
  };

  const downloadSong = (song: LocalSong) => {
    // Créer un lien de téléchargement pour le fichier MP3
    const link = document.createElement('a');
    link.href = `/data/music/${song.file}`;
    link.download = song.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openExternalPlaylist = (playlist: ExternalPlaylist) => {
    window.open(playlist.url, '_blank');
  };

  return (
    <>
      {/* Audio element */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={`/data/music/${currentSong.file}`}
          onEnded={() => {
            // Passer à la chanson suivante
            if (playlistData?.localSongs) {
              const currentIndex = playlistData.localSongs.findIndex(song => song.id === currentSong.id);
              const nextIndex = (currentIndex + 1) % playlistData.localSongs.length;
              playSong(playlistData.localSongs[nextIndex]);
            }
          }}
          onError={() => {
            console.error("Erreur lors de la lecture de la musique");
            stopMusic();
          }}
        />
      )}

      {/* Modal de bienvenue */}
      {showMusicWelcomeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <Music className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Voulez-vous jouer de la musique de fond ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Une playlist de motivation vous attend pour accompagner votre navigation.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleWelcomeAccept}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Oui, c'est parti ! 🎵
                </Button>
                <Button
                  onClick={handleWelcomeDecline}
                  variant="outline"
                  className="bg-card border-border text-foreground hover:bg-muted"
                >
                  Non, merci
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton flottant de musique */}
      <Dialog open={isMusicModalOpen} onOpenChange={setIsMusicModalOpen}>
        <DialogTrigger asChild>
                <button
                  className="fixed z-40 shadow-lg rounded-full music-float-btn focus:outline-none transition-all duration-200 hover:scale-105"
                  style={{
                    right: '20px',
                    bottom: '100px',
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Ouvrir le lecteur de musique"
                >
          <Music className="w-6 h-6 music-float-icon" />
                  {isPlaying && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  )}
                </button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Music className="w-6 h-6" />
              Lecteur de Musique
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Contrôles de lecture */}
            {currentSong && (
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{currentSong.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={togglePlayPause}
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={stopMusic}
                      size="sm"
                      variant="outline"
                      className="bg-card border-border text-foreground hover:bg-muted"
                    >
                      Stop
                    </Button>
                  </div>
                </div>
                
                {/* Contrôle du volume */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleMute}
                    size="sm"
                    variant="outline"
                    className="bg-card border-border text-foreground hover:bg-muted"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-8">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            )}

            {/* Playlist locale */}
            {playlistData?.localSongs && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🎵 Musique Locale</h3>
                <div className="space-y-2">
                  {playlistData.localSongs.map((song) => (
                    <div
                      key={song.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        currentSong?.id === song.id
                          ? 'bg-primary/20 border-primary/30'
                          : 'bg-muted/30 border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{song.title}</h4>
                        <p className="text-sm text-muted-foreground">{song.artist} • {song.duration}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => playSong(song)}
                          size="sm"
                          variant="outline"
                          className="bg-card border-border text-foreground hover:bg-muted"
                        >
                          {currentSong?.id === song.id && isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          onClick={() => downloadSong(song)}
                          size="sm"
                          variant="outline"
                          className="bg-card border-border text-foreground hover:bg-muted"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playlists externes */}
            {playlistData?.externalPlaylists && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">🌐 Playlists Externes</h3>
                <div className="space-y-2">
                  {playlistData.externalPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 border-border hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{playlist.icon}</span>
                        <div>
                          <h4 className="font-medium text-foreground">{playlist.name}</h4>
                          <p className="text-sm text-muted-foreground">{playlist.platform}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => openExternalPlaylist(playlist)}
                        size="sm"
                        variant="outline"
                        className="bg-card border-border text-foreground hover:bg-muted"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ouvrir
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message d'information */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                💡 Les fichiers MP3 sont stockés dans <code className="bg-muted px-1 rounded">public/data/music/</code>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MusicPlayer;
