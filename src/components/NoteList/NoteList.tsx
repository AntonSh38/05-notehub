import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note successfully deleted!!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Could not delete note.');
    },
  });

  if (notes.length === 0) {
    return null;
  }

  const handleDeleteClick =
    (noteId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
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
              disabled={deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? 'Deleting....' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
