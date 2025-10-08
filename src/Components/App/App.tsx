import { useState } from 'react';
import type { Movie } from '../../types/movie';
import toast, { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import css from './App.module.css';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setMovies([]);

      const data = await fetchMovies(query);

      if (data.results.length === 0) {
        toast.error('No movies found for your request.');
        setMovies([]);
      } else {
        setMovies(data.results);
      }
    } catch (error) {
      setIsError(true);
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />
      
        <Toaster position="top-center" />

        {isLoading && <Loader />}

        {isError && <ErrorMessage />}

        {!isLoading && !isError && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        )}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
}
