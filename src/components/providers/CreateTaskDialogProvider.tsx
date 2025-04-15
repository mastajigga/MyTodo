'use client';

import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { CreateTaskData } from "@/types/task";
import { createContext, ReactNode, useContext, useState } from "react";

interface CreateTaskDialogContextType {
  isOpen: boolean;
  projectId?: string;
  onSuccess?: () => void;
  openCreateTaskDialog: (projectId?: string, onSuccess?: () => void) => void;
  closeCreateTaskDialog: () => void;
}

const CreateTaskDialogContext = createContext<CreateTaskDialogContextType | undefined>(undefined);

export function useCreateTaskDialog() {
  const context = useContext(CreateTaskDialogContext);
  if (context === undefined) {
    throw new Error('useCreateTaskDialog must be used within a CreateTaskDialogProvider');
  }
  return context;
}

interface CreateTaskDialogProviderProps {
  children: ReactNode;
}

export function CreateTaskDialogProvider({ children }: CreateTaskDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectId, setProjectId] = useState<string>();
  const [onSuccess, setOnSuccess] = useState<(() => void) | undefined>();

  const openCreateTaskDialog = (projectId?: string, onSuccess?: () => void) => {
    setProjectId(projectId);
    setOnSuccess(() => onSuccess);
    setIsOpen(true);
  };

  const closeCreateTaskDialog = () => {
    setIsOpen(false);
    setProjectId(undefined);
    setOnSuccess(undefined);
  };

  return (
    <CreateTaskDialogContext.Provider
      value={{
        isOpen,
        projectId,
        onSuccess,
        openCreateTaskDialog,
        closeCreateTaskDialog,
      }}
    >
      {children}
      <CreateTaskDialog />
    </CreateTaskDialogContext.Provider>
  );
} 