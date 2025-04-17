/**
 * Supprime une entrée par son ID.
 * @param id L'identifiant de l'entrée à supprimer.
 * @returns Une promesse résolue si la suppression réussit.
 */
export async function deleteEntry(id: string): Promise<void> {
  // À adapter selon votre backend/API
  // Exemple fictif avec fetch :
  const response = await fetch(`/api/entries/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de l\'entrée');
  }
} 