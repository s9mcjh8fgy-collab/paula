"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createInteraction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const clientId = String(formData.get("client_id") ?? "");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const links = (formData.getAll("links") as string[]).map((l) => l.trim()).filter(Boolean);
  const images = (formData.getAll("images") as string[]).filter(Boolean);

  const { data: inserted, error } = await supabase
    .from("interactions")
    .insert({
      client_id: clientId,
      occurred_at: String(formData.get("occurred_at") ?? "") || new Date().toISOString(),
      channel: String(formData.get("channel") ?? "whatsapp"),
      requested_by: String(formData.get("requested_by") ?? "") || null,
      summary: String(formData.get("summary") ?? ""),
      response: String(formData.get("response") ?? "") || null,
      status: String(formData.get("status") ?? "pending"),
      tags,
      links,
      images,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/interactions/new?client_id=${clientId}&error=${encodeURIComponent(error.message)}`);
  }

  const taskTitles = formData.getAll("task_title") as string[];
  const taskDueDates = formData.getAll("task_due_date") as string[];
  const tasks = taskTitles
    .map((title, idx) => ({ title: title.trim(), due_date: taskDueDates[idx] || null }))
    .filter((t) => t.title);

  if (tasks.length > 0) {
    await supabase.from("tasks").insert(
      tasks.map((t) => ({
        title: t.title,
        due_date: t.due_date,
        client_id: clientId,
        interaction_id: inserted.id,
        created_by: user?.id ?? null,
      }))
    );
  }

  revalidatePath("/");
  revalidatePath("/interactions");
  revalidatePath(`/clients/${clientId}`);
  redirect(`/clients/${clientId}`);
}

export async function updateInteraction(interactionId: string, formData: FormData) {
  const supabase = await createClient();

  const clientId = String(formData.get("client_id") ?? "");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const links = (formData.getAll("links") as string[]).map((l) => l.trim()).filter(Boolean);
  const images = (formData.getAll("images") as string[]).filter(Boolean);

  const { error } = await supabase
    .from("interactions")
    .update({
      occurred_at: String(formData.get("occurred_at") ?? "") || new Date().toISOString(),
      channel: String(formData.get("channel") ?? "whatsapp"),
      requested_by: String(formData.get("requested_by") ?? "") || null,
      summary: String(formData.get("summary") ?? ""),
      response: String(formData.get("response") ?? "") || null,
      status: String(formData.get("status") ?? "pending"),
      tags,
      links,
      images,
    })
    .eq("id", interactionId);

  if (error) {
    redirect(`/interactions/${interactionId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/interactions");
  revalidatePath(`/clients/${clientId}`);
  redirect(`/clients/${clientId}`);
}
