import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VideoPlayer } from '@/components/ui/video-player';
import { CategorySlider } from '@/components/movie/category-slider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Movie } from '@shared/schema';
import { Play, Plus, ThumbsUp, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MoviePage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch the specific movie
  const { data: movie, isLoading: isMovieLoading } = useQuery<Movie>({
    queryKey: [`/api/movies/${id}`],
  });

  // Fetch all movies for recommendations
  const { data: allMovies, isLoading: isAllMoviesLoading } = useQuery<Movie[]>({
    queryKey: ['/api/movies'],
  });

  // Filter similar movies (same category as current movie)
  const similarMovies = allMovies && movie
    ? allMovies.filter(m => m.id !== movie.id && m.category === movie.category)
    : [];

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleAddToList = () => {
    toast({
      title: "Added to My List",
      description: `${movie?.title} has been added to your list.`,
    });
  };

  const handleLike = () => {
    toast({
      title: "Liked",
      description: `You liked ${movie?.title}.`,
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  if (isMovieLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <Skeleton className="w-full h-[600px] rounded-lg mb-8" />
          <Skeleton className="w-1/3 h-10 mb-4" />
          <Skeleton className="w-full h-24 mb-8" />
          <Skeleton className="w-48 h-8 mb-4" />
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-60 h-[360px] rounded-md" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Movie not found</h2>
          <p className="text-muted-foreground mb-6">
            The movie you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack}>
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        {isPlaying ? (
          <VideoPlayer
            title={movie.title}
            description={movie.description}
            videoUrl={movie.videoUrl}
            posterUrl={movie.thumbnailUrl}
            rating={movie.rating}
            year={movie.year}
            duration={movie.duration}
            score={movie.score}
          />
        ) : (
          <div className="relative rounded-lg overflow-hidden mb-8">
            <div 
              className="w-full h-[600px] bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.thumbnailUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg"
                  variant="default" 
                  className="rounded-full w-20 h-20 bg-primary/90 hover:bg-primary"
                  onClick={handlePlay}
                >
                  <Play className="h-10 w-10" />
                </Button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                <div className="flex items-center mb-4 text-sm">
                  <span className="bg-primary px-2 py-0.5 rounded mr-2">{(movie.score / 10).toFixed(1)}</span>
                  <span className="mr-2">{movie.year}</span>
                  <span className="mr-2">{movie.duration} min</span>
                  <span className="border border-muted-foreground/30 rounded px-1">{movie.rating}</span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="default" 
                    className="flex items-center space-x-2"
                    onClick={handlePlay}
                  >
                    <Play className="h-5 w-5" />
                    <span>Play</span>
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    className="flex items-center space-x-2"
                    onClick={handleAddToList}
                  >
                    <Plus className="h-5 w-5" />
                    <span>My List</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={handleLike}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>Like</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mb-12">
          <h2 className="text-2xl font-bold mb-4">About {movie.title}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{movie.description}</p>
        </div>
        
        {!isAllMoviesLoading && similarMovies.length > 0 && (
          <CategorySlider
            title="More Like This"
            movies={similarMovies}
            onPlay={(selectedMovie) => {
              navigate(`/movie/${selectedMovie.id}`);
            }}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
}
