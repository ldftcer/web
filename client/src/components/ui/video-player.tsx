import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, Subtitles } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface VideoPlayerProps {
  title: string;
  description: string;
  videoUrl: string;
  posterUrl?: string;
  rating?: string;
  year?: number;
  duration?: number;
  score?: number;
}

export function VideoPlayer({ 
  title, 
  description, 
  videoUrl, 
  posterUrl,
  rating,
  year,
  duration,
  score
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMovement = () => {
      setShowControls(true);
      clearTimeout(timeout);
      
      if (isPlaying) {
        timeout = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };
    
    const playerElement = playerRef.current;
    if (playerElement) {
      playerElement.addEventListener('mousemove', handleMovement);
      playerElement.addEventListener('mouseenter', handleMovement);
      playerElement.addEventListener('mouseleave', () => {
        if (isPlaying) setShowControls(false);
      });
    }
    
    return () => {
      clearTimeout(timeout);
      if (playerElement) {
        playerElement.removeEventListener('mousemove', handleMovement);
        playerElement.removeEventListener('mouseenter', handleMovement);
        playerElement.removeEventListener('mouseleave', () => {
          if (isPlaying) setShowControls(false);
        });
      }
    };
  }, [isPlaying]);
  
  // Update time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        toast({
          title: "Playback Error",
          description: "Could not play the video. Please try again.",
          variant: "destructive"
        });
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };
  
  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };
  
  const toggleFullScreen = () => {
    const player = playerRef.current;
    if (!player) return;
    
    if (!document.fullscreenElement) {
      player.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        toast({
          title: "Fullscreen Error",
          description: `Could not enter fullscreen mode: ${err.message}`,
          variant: "destructive"
        });
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      });
    }
  };
  
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  };
  
  const toggleSubtitles = () => {
    toast({
      title: "Subtitles",
      description: "Subtitles are not available for this video.",
    });
  };
  
  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden" ref={playerRef}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />
      
      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="h-20 w-20 rounded-full bg-primary/80 flex items-center justify-center">
            <Play className="h-10 w-10 text-white" />
          </div>
        </div>
      )}
      
      {/* Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-primary"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-primary"
                onClick={skipForward}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-primary"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <div className="w-20 hidden md:block">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-primary"
                onClick={toggleSubtitles}
              >
                <Subtitles className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-primary"
                onClick={toggleFullScreen}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Slider
              value={[currentTime]}
              min={0}
              max={videoDuration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>
          
          <div className="flex justify-between text-sm text-white/80 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(videoDuration || 0)}</span>
          </div>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center text-sm mt-1 mb-2">
          {score && <span className="bg-primary px-2 py-0.5 rounded mr-2">{(score / 10).toFixed(1)}</span>}
          {year && <span className="mr-2">{year}</span>}
          {duration && <span className="mr-2">{duration} min</span>}
          {rating && <span className="border border-accent/30 rounded px-1">{rating}</span>}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
