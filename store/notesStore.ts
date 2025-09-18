import { handleError } from '@/services/errorHandler';
import {
    getAllNotes,
    getNoteById,
    Note,
    deleteNote as storageDeleteNote,
    saveNote as storageSaveNote,
} from '@/src/native/storage/notesStorage';
import { create } from 'zustand';

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
}

interface NotesActions {
  init: () => Promise<void>;
  fetchNote: (id: number) => Promise<void>;
  saveNote: (
    note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: number }
  ) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  clearCurrentNote: () => void;
}

export const useNotesStore = create<NotesState & { actions: NotesActions }>(
  (set) => ({

    notes: [],
    currentNote: null,
    isLoading: false,

    actions: {
      init: async () => {
        set({ isLoading: true });
        try {
          const notes = await getAllNotes();
          set({ notes, isLoading: false });
        } catch (error) {
          handleError(error, 'notesStore:init');
          set({ isLoading: false });
        }
      },

      fetchNote: async (id: number) => {
        set({ isLoading: true, currentNote: null });
        try {
          const note = await getNoteById(id);
          set({ currentNote: note, isLoading: false });
        } catch (error) {
          handleError(error, 'notesStore:fetchNote', { noteId: id });
          set({ isLoading: false });
        }
      },

      saveNote: async (noteData) => {
        set({ isLoading: true });
        try {
          const savedNote = await storageSaveNote(noteData);
          set((state) => {
            const noteExists = state.notes.find((n) => n.id === savedNote.id);
            const updatedNotes = noteExists
              ? state.notes.map((n) => (n.id === savedNote.id ? savedNote : n))
              : [savedNote, ...state.notes];
            return {
              notes: updatedNotes,
              currentNote: savedNote,
              isLoading: false,
            };
          });
          return savedNote;
        } catch (error) {
          handleError(error, 'notesStore:saveNote', { noteData });
          set({ isLoading: false });
          throw error;
        }
      },

      deleteNote: async (id: number) => {
        set({ isLoading: true });
        try {
          await storageDeleteNote(id);
          set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
            currentNote:
              state.currentNote?.id === id ? null : state.currentNote,
            isLoading: false,
          }));
        } catch (error) {
          handleError(error, 'notesStore:deleteNote', { noteId: id });
          set({ isLoading: false });
          throw error;
        }
      },

      clearCurrentNote: () => set({ currentNote: null }),
    },
  })
);

export const useNotesActions = () => useNotesStore((state) => state.actions);
export const useNotes = () => useNotesStore((state) => state.notes);
export const useCurrentNote = () => useNotesStore((state) => state.currentNote);
export const useIsNotesLoading = () => useNotesStore((state) => state.isLoading);

export const initializeNotesStore = (): void => {
  useNotesStore.getState().actions.init();
};
