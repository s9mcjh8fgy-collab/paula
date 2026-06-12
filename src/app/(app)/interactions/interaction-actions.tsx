"use client";

import { deleteInteraction } from "./actions";

export function DeleteInteractionButton({ interactionId }: { interactionId: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm("Excluir esta demanda? Essa ação não pode ser desfeita.")) {
          deleteInteraction(interactionId);
        }
      }}
      className="text-sm text-pccinza hover:text-red-600"
      aria-label="Excluir demanda"
    >
      Excluir
    </button>
  );
}
