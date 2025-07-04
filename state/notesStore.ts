
import { getAllNotes, getNoteById, Note, deleteNote as storageDeleteNote, saveNote as storageSaveNote } from '@/storage/notesStorage';
import { create } from 'zustand';

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  actions: {
    fetchAllNotes: () => Promise<void>;
    fetchNote: (id: number) => Promise<void>;
    saveNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: number }) => Promise<Note>;
    deleteNote: (id: number) => Promise<void>;
    clearCurrentNote: () => void;
  };
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  actions: {
    fetchAllNotes: async () => {
      set({ isLoading: true, error: null });
      try {
        const notes = await getAllNotes();
        set({ notes, isLoading: false });
      } catch (error) {
        set({ isLoading: false, error: 'Falha ao carregar as notas.' });
      }
    },
    fetchNote: async (id: number) => {
      set({ isLoading: true, currentNote: null, error: null });
      try {
        const note = await getNoteById(id);
        set({ currentNote: note, isLoading: false });
      } catch (error) {
        set({ isLoading: false, error: 'Falha ao carregar a nota.' });
      }
    },
    saveNote: async (noteData) => {
      set({ isLoading: true, error: null });
      try {
        const savedNote = await storageSaveNote(noteData);
        set(state => {
          const noteExists = state.notes.find(n => n.id === savedNote.id);
          const updatedNotes = noteExists
            ? state.notes.map(n => n.id === savedNote.id ? savedNote : n)
            : [savedNote, ...state.notes];
          return { notes: updatedNotes, currentNote: savedNote, isLoading: false };
        });
        return savedNote;
      } catch (error) {
        set({ isLoading: false, error: 'Falha ao guardar a nota.' });
        throw error;
      }
    },
    deleteNote: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await storageDeleteNote(id);
            set(state => ({
                notes: state.notes.filter(n => n.id !== id),
                currentNote: state.currentNote?.id === id ? null : state.currentNote,
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false, error: 'Falha ao apagar a nota.' });
        }
    },
    clearCurrentNote: () => set({ currentNote: null, error: null }),
  },
}));

export const useNotesActions = () => useNotesStore(state => state.actions);