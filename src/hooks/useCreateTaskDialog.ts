import { StateCreator, create } from 'zustand';

interface CreateTaskDialogState {
  isOpen: boolean;
  projectId?: string;
  onSuccess?: () => void;
  openCreateTaskDialog: (options: { projectId?: string; onSuccess?: () => void }) => void;
  closeCreateTaskDialog: () => void;
}

type CreateTaskDialogStore = StateCreator<
  CreateTaskDialogState,
  [],
  [],
  CreateTaskDialogState
>;

export const useCreateTaskDialog = create<CreateTaskDialogState>(
  ((set) => ({
    isOpen: false,
    projectId: undefined,
    onSuccess: undefined,
    openCreateTaskDialog: ({ projectId, onSuccess }: { projectId?: string; onSuccess?: () => void }) => 
      set({ isOpen: true, projectId, onSuccess }),
    closeCreateTaskDialog: () => 
      set({ isOpen: false, projectId: undefined, onSuccess: undefined }),
  })) as CreateTaskDialogStore
); 