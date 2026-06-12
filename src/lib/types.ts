export type Channel = "whatsapp" | "email" | "call" | "meeting" | "in_person";
export type InteractionStatus = "pending" | "in_progress" | "done";
export type ClientStatus = "active" | "inactive";

export const CHANNEL_LABELS: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  email: "E-mail",
  call: "Ligação",
  meeting: "Reunião",
  in_person: "Presencial",
};

export const STATUS_LABELS: Record<InteractionStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  done: "Concluído",
};

export interface Contact {
  name: string;
  phone?: string;
  email?: string;
}

export interface Client {
  id: string;
  name: string;
  document: string | null;
  contacts: Contact[];
  folder_url: string | null;
  notes: string | null;
  status: ClientStatus;
  created_at: string;
}

export interface Interaction {
  id: string;
  number: number;
  client_id: string;
  occurred_at: string;
  channel: Channel;
  requested_by: string | null;
  summary: string;
  response: string | null;
  links: string[];
  images: string[];
  status: InteractionStatus;
  tags: string[];
  created_by: string | null;
  created_at: string;
  clients?: { name: string };
}

export type TaskStatus = "pending" | "in_progress" | "done";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  done: "Concluída",
};

export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  client_id: string | null;
  interaction_id: string | null;
  created_by: string | null;
  created_at: string;
  clients?: { name: string } | null;
}
