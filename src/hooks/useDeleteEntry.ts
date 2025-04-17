import { deleteEntry as deleteEntryAPI } from "../api/apiEntry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteEntry } = useMutation({
    mutationFn: deleteEntryAPI,
    onMutate: async (empId) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ["entries"] });

      // Snapshot de l'état précédent
      const previousEntries = queryClient.getQueryData(["entries"]);

      // Mise à jour optimiste
      queryClient.setQueryData(["entries"], (old: any[]) => 
        old?.filter(entry => entry.emp_id !== empId)
      );

      return { previousEntries };
    },
    onError: (err, empId, context: any) => {
      // En cas d'erreur, restaurer l'état précédent
      queryClient.setQueryData(["entries"], context.previousEntries);
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Entrée supprimée");
      // Invalider et recharger les données
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
    onSettled: () => {
      // Recharger les données dans tous les cas
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  return { isDeleting, deleteEntry };
}; 