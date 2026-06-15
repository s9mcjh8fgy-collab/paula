"use client";

import { useState } from "react";
import { ASSIGNEES } from "@/lib/types";

export function NewTasksInput() {
  const [rows, setRows] = useState<{ title: string; due_date: string; assigned_to: string }[]>([]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-pcmarrom">Tarefas para esta demanda</label>
        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, { title: "", due_date: "", assigned_to: "" }])}
          className="text-xs font-medium text-pclaranja hover:underline"
        >
          + adicionar tarefa
        </button>
      </div>
      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((row, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                name="task_title"
                placeholder="Título da tarefa"
                defaultValue={row.title}
                className="flex-1 rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
              />
              <input
                name="task_due_date"
                type="date"
                defaultValue={row.due_date}
                className="rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
              />
              <select
                name="task_assigned_to"
                defaultValue={row.assigned_to}
                className="rounded-lg border border-pccinza/40 px-3 py-2 text-sm shadow-sm focus:border-pclaranja focus:ring-pclaranja"
              >
                <option value="">Responsável</option>
                {ASSIGNEES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setRows((prev) => prev.filter((_, i) => i !== idx))}
                className="rounded-lg border border-pccinza/40 px-2 text-sm text-pccinza hover:bg-pcbege"
                aria-label="Remover tarefa"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
