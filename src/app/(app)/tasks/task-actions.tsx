"use client";

import { setTaskStatus, deleteTask } from "./actions";
import { TASK_STATUS_LABELS, type TaskStatus } from "@/lib/types";

export function ToggleTaskButton({ taskId, status, path }: { taskId: string; status: TaskStatus; path?: string }) {
  const colors: Record<TaskStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    in_progress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  };

  return (
    <select
      value={status}
      onChange={(e) => setTaskStatus(taskId, e.target.value, path)}
      className={`rounded-full border-0 px-2 py-0.5 text-xs font-medium ${colors[status]}`}
    >
      {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

export function DeleteTaskButton({ taskId, path }: { taskId: string; path?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm("Excluir esta tarefa?")) deleteTask(taskId, path);
      }}
      className="text-sm text-gray-400 hover:text-red-600"
      aria-label="Excluir tarefa"
    >
      Excluir
    </button>
  );
}
