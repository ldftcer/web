import { useState } from 'react';
import { Link } from 'wouter';
import { Play, Plus, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Movie } from '@shared/schema';

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
}

export function MovieCard({ movie, onPlay }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onPlay) {
      onPlay(movie);
    }
  };
  
  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Added to My List",
      description: `${movie.title} has been added to your list.`,
    });
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Liked",
      description: `You liked ${movie.title}.`,
    });
  };
  
  return (
    <Link href={`/movie/${movie.id}`}>
      <a
        className={cn(
          "movie-card flex-shrink-0 w-60 rounded-md overflow-hidden group relative",
          "transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:z-10"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={movie.thumbnailUrl} 
          alt={movie.title} 
          className="w-full h-[360px] object-cover"
        />
        
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent",
          "flex flex-col justify-end p-4 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <h3 className="font-semibold text-white">{movie.title}</h3>
          <div className="flex items-center text-xs mt-1">
            <span className="bg-primary px-1 rounded mr-2">{(movie.score / 10).toFixed(1)}</span>
            <span className="text-white">{movie.year}</span>
          </div>
          
          <div className="flex items-center space-x-2 mt-3">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full bg-white hover:bg-primary"
              onClick={handlePlay}
            >
              <Play className="h-4 w-4 text-black" />
            </Button>
            
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full bg-muted/60 hover:bg-muted"
              onClick={handleAddToList}
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full bg-muted/60 hover:bg-muted"
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </a>
    </Link>
  );
}
