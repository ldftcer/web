import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroBanner } from '@/components/movie/hero-banner';
import { CategorySlider } from '@/components/movie/category-slider';
import { VideoPlayer } from '@/components/ui/video-player';
import { useLocation } from 'wouter';
import { Movie } from '@shared/schema';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [location, navigate] = useLocation();
  
  // Get category from URL if present
  const params = new URLSearchParams(location.split('?')[1]);
  const categoryFilter = params.get('category');
  
  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ['/api/movies'],
  });
  
  // Use memoized callback to prevent unnecessary re-renders
  const handlePlayMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
  }, []);
  
  // Reset selected movie when dialog is closed
  useEffect(() => {
    if (!isPlayerOpen) {
      // Small delay to prevent DOM removal during animation
      const timeout = setTimeout(() => {
        setSelectedMovie(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isPlayerOpen]);
  
  const handleSearch = (query: string) => {
    // In a real app, this would redirect to a search results page
    // For this demo, we'll just log the query
    console.log(`Searching for: ${query}`);
  };
  
  // Filter movies by category if a filter is applied
  const filteredMovies = categoryFilter && movies 
    ? movies.filter(movie => movie.category === categoryFilter)
    : movies;
  
  // Get a featured movie for the hero banner (first movie or random)
  const featuredMovie = movies && movies.length > 0 
    ? movies[0] 
    : null;
  
  // Group movies by category for sliders
  const moviesByCategory = filteredMovies && filteredMovies.length > 0
    ? filteredMovies.reduce((acc, movie) => {
        if (!acc[movie.category]) {
          acc[movie.category] = [];
        }
        acc[movie.category].push(movie);
        return acc;
      }, {} as Record<string, Movie[]>)
    : {};
  
  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="w-full h-[70vh] rounded-lg" />
          <div className="mt-12 space-y-12">
            <div>
              <Skeleton className="w-48 h-8 mb-4" />
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-60 h-[360px] rounded-md" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="w-48 h-8 mb-4" />
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-60 h-[360px] rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {featuredMovie && (
            <HeroBanner 
              movie={featuredMovie} 
              onPlay={() => handlePlayMovie(featuredMovie)} 
            />
          )}
          
          <div className="container mx-auto px-4">
            {filteredMovies && filteredMovies.length > 0 ? (
              <>
                {/* If filtering by category, show all as "Featured" */}
                {categoryFilter && (
                  <CategorySlider
                    title={`${categoryFilter} Movies`}
                    movies={filteredMovies}
                    onPlay={handlePlayMovie}
                  />
                )}
                
                {/* Otherwise show by category */}
                {!categoryFilter && Object.entries(moviesByCategory).map(([category, movies]) => (
                  <CategorySlider
                    key={category}
                    title={category}
                    movies={movies}
                    onPlay={handlePlayMovie}
                  />
                ))}
              </>
            ) : (
              <div className="py-20 text-center">
                <h2 className="text-2xl font-bold mb-2">No movies found</h2>
                <p className="text-muted-foreground">
                  {categoryFilter 
                    ? `No movies found in the ${categoryFilter} category.` 
                    : 'No movies found in the library.'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
      
      <Footer />
      
      {/* Video Player Dialog */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-5xl">
          {selectedMovie && (
            <VideoPlayer
              title={selectedMovie.title}
              description={selectedMovie.description}
              videoUrl={selectedMovie.videoUrl}
              posterUrl={selectedMovie.thumbnailUrl}
              rating={selectedMovie.rating}
              year={selectedMovie.year}
              duration={selectedMovie.duration}
              score={selectedMovie.score}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
