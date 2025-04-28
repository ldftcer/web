import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from './movie-card';
import { Movie } from '@shared/schema';

interface CategorySliderProps {
  title: string;
  movies: Movie[];
  onPlay?: (movie: Movie) => void;
}

export function CategorySlider({ title, movies, onPlay }: CategorySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  if (!movies || movies.length === 0) {
    return null;
  }
  
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={sliderRef}
        className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onPlay={onPlay} />
        ))}
      </div>
    </section>
  );
}
