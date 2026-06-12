"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTask(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const clientId = String(formData.get("client_id") ?? "") || null;
  const interactionId = String(formData.get("interaction_id") ?? "") || null;
  const redirectTo = String(formData.get("redirect_to") ?? "") || "/tasks";

  const { error } = await supabase.from("tasks").insert({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? "") || null,
    due_date: String(formData.get("due_date") ?? "") || null,
    status: String(formData.get("status") ?? "pending"),
    client_id: clientId,
    interaction_id: interactionId,
    created_by: user?.id ?? null,
  });

  if (error) {
    redirect(`${redirectTo}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/tasks");
  revalidatePath(redirectTo);
  redirect(redirectTo);
}

export async function updateTask(taskId: string, formData: FormData) {
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "") || null;
  const redirectTo = String(formData.get("redirect_to") ?? "") || "/tasks";

  const { error } = await supabase
    .from("tasks")
    .update({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      due_date: String(formData.get("due_date") ?? "") || null,
      status: String(formData.get("status") ?? "pending"),
      client_id: clientId,
    })
    .eq("id", taskId);

  if (error) {
    redirect(`/tasks/${taskId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/tasks");
  revalidatePath(redirectTo);
  redirect(redirectTo);
}

export async function setTaskStatus(taskId: string, status: string, path?: string) {
  const supabase = await createClient();

  await supabase.from("tasks").update({ status }).eq("id", taskId);

  revalidatePath("/tasks");
  if (path) revalidatePath(path);
}

export async function deleteTask(taskId: string, path?: string) {
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", taskId);
  revalidatePath("/tasks");
  if (path) revalidatePath(path);
}
