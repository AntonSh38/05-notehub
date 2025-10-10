import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import Pagination from '../Pagination/Pagination';
import css from './App.module.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies({ query: searchQuery, page }),
    enabled: searchQuery.length > 0,
    placeholderData: keepPreviousData,
  });

  const handleSearch = (query: string) => {
    if (query === searchQuery) {
      return;
    }

    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  if (data && data.results.length === 0 && !isLoading) {
    toast.error('No movies found for your request.', { id: 'no-results' });
  }

  if (isError) {
    console.error('Query error:', error);
  }

  const movies = (data && data.results) || [];
  const totalPages = (data && data.total_pages) || 0;

  return (
    <>
      <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />

        <Toaster position="top-center" />

        {isLoading && <Loader />}

        {isError && <ErrorMessage />}

        {!isLoading && !isError && searchQuery && movies.length > 0 && (
          <>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            )}
            <MovieGrid movies={movies} onSelect={handleSelectMovie} />
          </>
        )}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
}
