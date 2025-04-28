import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Movie, insertMovieSchema } from '@shared/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export function ContentManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editMovie, setEditMovie] = useState<Movie | null>(null);
  const { toast } = useToast();
  
  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ['/api/movies'],
  });
  
  const createMovieMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/admin/movies', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create movie');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Movie created',
        description: 'The movie has been successfully added to the library',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      setAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create movie',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const updateMovieMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Movie> }) => {
      const res = await apiRequest('PUT', `/api/admin/movies/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Movie updated',
        description: 'The movie has been successfully updated',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
      setEditMovie(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update movie',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const deleteMovieMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/movies/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Movie deleted',
        description: 'The movie has been successfully removed from the library',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete movie',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const form = useForm({
    resolver: zodResolver(insertMovieSchema),
    defaultValues: {
      title: '',
      description: '',
      thumbnailUrl: '',
      videoUrl: '',
      year: 2023,
      duration: 120,
      rating: 'PG-13',
      score: 75,
      category: 'Action',
    },
  });
  
  const editForm = useForm({
    resolver: zodResolver(insertMovieSchema.partial()),
    defaultValues: {
      title: '',
      description: '',
      thumbnailUrl: '',
      videoUrl: '',
      year: 2023,
      duration: 120,
      rating: 'PG-13',
      score: 75,
      category: 'Action',
    },
  });
  
  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    createMovieMutation.mutate(formData);
  };
  
  const handleEditMovie = (movie: Movie) => {
    setEditMovie(movie);
    editForm.reset({
      title: movie.title,
      description: movie.description,
      thumbnailUrl: movie.thumbnailUrl,
      videoUrl: movie.videoUrl,
      year: movie.year,
      duration: movie.duration,
      rating: movie.rating,
      score: movie.score,
      category: movie.category,
    });
  };
  
  const handleUpdateMovie = (data: Partial<Movie>) => {
    if (editMovie) {
      updateMovieMutation.mutate({ id: editMovie.id, data });
    }
  };
  
  const handleDeleteMovie = (id: number) => {
    // Confirm before deletion
    if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      deleteMovieMutation.mutate(id);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Movie</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFileUpload} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="year" className="text-sm font-medium">Year</label>
                  <Input id="year" name="year" type="number" min="1900" max="2099" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea id="description" name="description" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <select id="category" name="category" className="w-full px-3 py-2 bg-background border border-input rounded-md" required>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Horror">Horror</option>
                    <option value="Documentary">Documentary</option>
                    <option value="TV">TV Shows</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="rating" className="text-sm font-medium">Rating</label>
                  <select id="rating" name="rating" className="w-full px-3 py-2 bg-background border border-input rounded-md" required>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</label>
                  <Input id="duration" name="duration" type="number" min="1" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="score" className="text-sm font-medium">Score (0-100)</label>
                  <Input id="score" name="score" type="number" min="0" max="100" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="thumbnail" className="text-sm font-medium">Thumbnail Image</label>
                <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="video" className="text-sm font-medium">Video File</label>
                <Input id="video" name="video" type="file" accept="video/*" required />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMovieMutation.isPending}>
                  {createMovieMutation.isPending ? 'Uploading...' : 'Upload Movie'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Edit Movie Dialog */}
      <Dialog open={!!editMovie} onOpenChange={(open) => !open && setEditMovie(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateMovie)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1900" max="2099" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Action">Action</SelectItem>
                          <SelectItem value="Comedy">Comedy</SelectItem>
                          <SelectItem value="Drama">Drama</SelectItem>
                          <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                          <SelectItem value="Horror">Horror</SelectItem>
                          <SelectItem value="Documentary">Documentary</SelectItem>
                          <SelectItem value="TV">TV Shows</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="G">G</SelectItem>
                          <SelectItem value="PG">PG</SelectItem>
                          <SelectItem value="PG-13">PG-13</SelectItem>
                          <SelectItem value="R">R</SelectItem>
                          <SelectItem value="NC-17">NC-17</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score (0-100)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" max="100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditMovie(null)}>Cancel</Button>
                <Button type="submit" disabled={updateMovieMutation.isPending}>
                  {updateMovieMutation.isPending ? 'Updating...' : 'Update Movie'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Movies Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies && movies.length > 0 ? (
              movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="h-16 w-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell>{movie.category}</TableCell>
                  <TableCell>{movie.year}</TableCell>
                  <TableCell>{movie.rating}</TableCell>
                  <TableCell>{movie.score}/100</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditMovie(movie)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteMovie(movie.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No movies found. Click "Add Movie" to add content to your library.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
