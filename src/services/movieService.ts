import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { TMDBResponse } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies(query: string): Promise<TMDBResponse> {
  const response: AxiosResponse<TMDBResponse> = await axios.get(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page: 1,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
  return response.data;
}
