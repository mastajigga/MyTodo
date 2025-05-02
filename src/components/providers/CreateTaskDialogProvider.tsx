'use client';

import { CreateTaskDialog } from "@/components/tasks/CreateTaskDialog";
import { CreateTaskData } from "@/@types/task";
import { createContext, ReactNode, useContext, useState } from "react";

interface CreateTaskDialogContextType {
  isOpen: boolean;
  projectId: string | null;
  onSuccess?: () => void;
  openCreateTaskDialog: (projectId?: string, onSuccess?: () => void) => void;
  closeCreateTaskDialog: () => void;
}

const CreateTaskDialogContext = createContext<CreateTaskDialogContextType | null>(null);

export function useCreateTaskDialog() {
  const context = useContext(CreateTaskDialogContext);
  
  if (!context) {
    throw new Error('useCreateTaskDialog doit être utilisé à l\'intérieur d\'un CreateTaskDialogProvider');
  }
  
  return context;
}

interface CreateTaskDialogProviderProps {
  children: ReactNode;
}

export function CreateTaskDialogProvider({ children }: CreateTaskDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | undefined>();

  const openCreateTaskDialog = (newProjectId?: string, onSuccess?: () => void) => {
    setProjectId(newProjectId || null);
    setOnSuccessCallback(() => onSuccess);
    setIsOpen(true);
  };

  const closeCreateTaskDialog = () => {
    setIsOpen(false);
    setProjectId(null);
    setOnSuccessCallback(undefined);
  };

  return (
    <CreateTaskDialogContext.Provider
      value={{
        isOpen,
        projectId,
        onSuccess: onSuccessCallback,
        openCreateTaskDialog,
        closeCreateTaskDialog,
      }}
    >
      {children}
      <CreateTaskDialog />
    </CreateTaskDialogContext.Provider>
  );
} 