import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> {
  if (!TOKEN) {
    throw new Error('NoteHub token is not configured');
  }

  const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    params: {
      page,
      perPage,
      ...(search && { search }),
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
}

export async function createNote(noteData: CreateNoteData): Promise<Note> {
  if (!TOKEN) {
    throw new Error('NoteHub token is not configured');
  }

  const response = await axios.post<Note>(`${BASE_URL}/notes`, noteData, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  if (!TOKEN) {
    throw new Error('NoteHub token is not configured');
  }

  const response = await axios.delete<Note>(`${BASE_URL}/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
}
