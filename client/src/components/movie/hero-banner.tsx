import { Link } from 'wouter';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@shared/schema';

interface HeroBannerProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
}

export function HeroBanner({ movie, onPlay }: HeroBannerProps) {
  if (!movie) return null;
  
  const handlePlay = () => {
    if (onPlay) {
      onPlay(movie);
    }
  };
  
  return (
    <section className="relative">
      <div 
        className="w-full h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.thumbnailUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent"></div>
        
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-20">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center mb-4 text-sm">
              <span className="bg-primary px-2 py-0.5 rounded mr-2">{(movie.score / 10).toFixed(1)}</span>
              <span className="mr-2">{movie.year}</span>
              <span className="mr-2">{movie.duration} min</span>
              <span className="border border-muted-foreground/30 rounded px-1">{movie.rating}</span>
            </div>
            <p className="text-muted-foreground mb-6 line-clamp-3">{movie.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="default" 
                size="lg" 
                className="flex items-center space-x-2"
                onClick={handlePlay}
              >
                <Play className="h-5 w-5" />
                <span>Play</span>
              </Button>
              
              <Link href={`/movie/${movie.id}`}>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <Info className="h-5 w-5" />
                  <span>More Info</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
