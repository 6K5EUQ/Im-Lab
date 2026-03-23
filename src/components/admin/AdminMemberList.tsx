"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import type { Profile, Position } from "@/lib/types";
import { Plus, Trash2, Save, X } from "lucide-react";

interface AdminMemberListProps {
  members: Profile[];
}

const POSITIONS: Position[] = [
  "professor",
  "phd",
  "master",
  "undergraduate",
  "researcher",
  "alumni",
];

export default function AdminMemberList({ members }: AdminMemberListProps) {
  const t = useTranslations();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    name_en: "",
    student_id: "",
    position: "master" as Position,
    email: "",
    phone: "",
    bio: "",
    bio_en: "",
    is_active: true,
  });

  function resetForm() {
    setForm({
      name: "",
      name_en: "",
      student_id: "",
      position: "master",
      email: "",
      phone: "",
      bio: "",
      bio_en: "",
      is_active: true,
    });
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(member: Profile) {
    setForm({
      name: member.name,
      name_en: member.name_en ?? "",
      student_id: member.student_id ?? "",
      position: member.position,
      email: member.email,
      phone: member.phone ?? "",
      bio: member.bio ?? "",
      bio_en: member.bio_en ?? "",
      is_active: member.is_active,
    });
    setEditingId(member.id);
    setShowForm(true);
  }

  async function handleSave() {
    const supabase = createClient();
    const data = {
      name: form.name,
      name_en: form.name_en || null,
      student_id: form.student_id || null,
      position: form.position,
      email: form.email,
      phone: form.phone || null,
      bio: form.bio || null,
      bio_en: form.bio_en || null,
      is_active: form.is_active,
    };

    if (editingId) {
      await supabase.from("profiles").update(data).eq("id", editingId);
    }
    // Note: new member creation requires Supabase Auth signup first
    // For now, members are created via signup and edited here

    resetForm();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    const supabase = createClient();
    await supabase.from("profiles").update({ is_active: false }).eq("id", id);
    router.refresh();
  }

  return (
    <div>
      {showForm && (
        <div className="mb-6 rounded-xl border border-border p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">
              {editingId ? t("members.editMember") : t("members.addMember")}
            </h3>
            <button onClick={resetForm}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t("members.name") + " (KO)"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              placeholder={t("members.name") + " (EN)"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={form.student_id}
              onChange={(e) => setForm({ ...form, student_id: e.target.value })}
              placeholder={t("members.studentId")}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <select
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value as Position })
              }
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {t(`members.${pos}`)}
                </option>
              ))}
            </select>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t("members.email")}
              type="email"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t("members.phone")}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder={t("members.bio") + " (KO)"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              rows={2}
            />
            <textarea
              value={form.bio_en}
              onChange={(e) => setForm({ ...form, bio_en: e.target.value })}
              placeholder={t("members.bio") + " (EN)"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              rows={2}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              Active
            </label>
            <button
              onClick={handleSave}
              className="ml-auto flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              {t("common.save")}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                {t("members.name")}
              </th>
              <th className="px-4 py-3 text-left font-medium">
                {t("members.studentId")}
              </th>
              <th className="px-4 py-3 text-left font-medium">
                {t("members.position")}
              </th>
              <th className="px-4 py-3 text-left font-medium">
                {t("members.email")}
              </th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {m.student_id ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">
                    {t(`members.${m.position}`)}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium ${m.is_active ? "text-green-600" : "text-red-500"}`}
                  >
                    {m.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => startEdit(m)}
                    className="mr-2 text-xs text-primary hover:underline"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    <Trash2 className="inline h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
