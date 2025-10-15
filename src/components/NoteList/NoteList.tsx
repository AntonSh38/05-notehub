import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note successfully deleted!!');
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Could not delete note.');
      setDeletingId(null);
    },
  });

  if (notes.length === 0) {
    return null;
  }

  const handleDeleteClick =
    (noteId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDeletingId(noteId);
      deleteNoteMutation.mutate(noteId);
    };

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={handleDeleteClick(note.id)}
              type="button"
              disabled={deleteNoteMutation.isPending && deletingId === note.id}
            >
              {deleteNoteMutation.isPending && deletingId === note.id
                ? 'Deleting....'
                : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
