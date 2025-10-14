import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';
import {
  createNote,
  deleteNote,
  fetchNotes,
  type CreateNoteData,
} from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Pagination from '../Pagination/Pagination';
import css from './App.module.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const [debounceedSearch] = useDebounce(searchQuery, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debounceedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debounceedSearch,
      }),
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully!');
      setIsModalOpen(false);
      setPage(1);
    },
    onError: () => {
      toast.error('Failed to create note');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note successfully deleted!!');
    },
    onError: () => {
      toast.error('Could not delete note.');
    },
  });

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  const handleCreateNote = (values: CreateNoteData): void => {
    createNoteMutation.mutate(values);
  };

  const handleDeleteNote = (noteId: string): void => {
    deleteNoteMutation.mutate(noteId);
  };

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <>
      <div className={css.app}>
        <Toaster position="top-center" />

        <header className={css.toolbar}>
          <SearchBox value={searchQuery} onChange={handleSearchChange} />

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}

          <button
            type="button"
            className={css.button}
            onClick={handleOpenModal}
          >
            Create note +
          </button>
        </header>

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {!isLoading && !isError && notes.length > 0 && (
          <NoteList notes={notes} onDelete={handleDeleteNote} />
        )}

        {!isLoading && !isError && notes.length === 0 && (
          <p className={css.emptyMessage}>
            {searchQuery ? 'No notes found for your search' : null}
          </p>
        )}

        {isModalOpen && (
          <Modal onClose={handleCloseModal}>
            <NoteForm onSubmit={handleCreateNote} onCancel={handleCloseModal} />
          </Modal>
        )}
      </div>
    </>
  );
}
