"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Contact } from "@/lib/types";

function parseContacts(formData: FormData): Contact[] {
  const names = formData.getAll("contact_name") as string[];
  const phones = formData.getAll("contact_phone") as string[];
  const emails = formData.getAll("contact_email") as string[];

  return names
    .map((name, i) => ({
      name: name.trim(),
      phone: (phones[i] ?? "").trim(),
      email: (emails[i] ?? "").trim(),
    }))
    .filter((c) => c.name);
}

export async function createClientRecord(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: String(formData.get("name") ?? ""),
      document: String(formData.get("document") ?? "") || null,
      folder_url: String(formData.get("folder_url") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
      status: String(formData.get("status") ?? "active"),
      contacts: parseContacts(formData),
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/clients/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/clients");
  redirect(`/clients/${data.id}`);
}

export async function updateClientRecord(clientId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("clients")
    .update({
      name: String(formData.get("name") ?? ""),
      document: String(formData.get("document") ?? "") || null,
      folder_url: String(formData.get("folder_url") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
      status: String(formData.get("status") ?? "active"),
      contacts: parseContacts(formData),
    })
    .eq("id", clientId);

  if (error) {
    redirect(`/clients/${clientId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  redirect(`/clients/${clientId}`);
}
