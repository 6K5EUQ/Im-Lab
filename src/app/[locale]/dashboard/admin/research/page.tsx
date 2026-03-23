"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save } from "lucide-react";
import type {
  ResearchProject,
  Publication,
  ProjectStatus,
  PublicationType,
} from "@/lib/types";

const STATUSES: ProjectStatus[] = ["ongoing", "completed", "planned"];
const PUB_TYPES: PublicationType[] = [
  "journal",
  "conference",
  "workshop",
  "thesis",
  "patent",
  "other",
];

export default function AdminResearchPage() {
  const t = useTranslations();
  const router = useRouter();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [tab, setTab] = useState<"projects" | "publications">("projects");

  // Project form
  const [showProjForm, setShowProjForm] = useState(false);
  const [editProjId, setEditProjId] = useState<string | null>(null);
  const [projForm, setProjForm] = useState({
    title: "",
    title_en: "",
    description: "",
    description_en: "",
    status: "ongoing" as ProjectStatus,
    progress: 0,
    start_date: "",
    end_date: "",
    funding_source: "",
  });

  // Publication form
  const [showPubForm, setShowPubForm] = useState(false);
  const [editPubId, setEditPubId] = useState<string | null>(null);
  const [pubForm, setPubForm] = useState({
    title: "",
    authors: "",
    venue: "",
    year: new Date().getFullYear(),
    doi: "",
    url: "",
    pub_type: "journal" as PublicationType,
    project_id: "",
    is_featured: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const [projRes, pubRes] = await Promise.all([
      supabase
        .from("research_projects")
        .select("*")
        .order("display_order")
        .order("created_at", { ascending: false }),
      supabase
        .from("publications")
        .select("*")
        .order("year", { ascending: false })
        .order("display_order"),
    ]);
    setProjects(projRes.data ?? []);
    setPublications(pubRes.data ?? []);
  }

  // Project CRUD
  function resetProjForm() {
    setProjForm({
      title: "",
      title_en: "",
      description: "",
      description_en: "",
      status: "ongoing",
      progress: 0,
      start_date: "",
      end_date: "",
      funding_source: "",
    });
    setShowProjForm(false);
    setEditProjId(null);
  }

  function startEditProj(p: ResearchProject) {
    setProjForm({
      title: p.title,
      title_en: p.title_en ?? "",
      description: p.description ?? "",
      description_en: p.description_en ?? "",
      status: p.status,
      progress: p.progress,
      start_date: p.start_date ?? "",
      end_date: p.end_date ?? "",
      funding_source: p.funding_source ?? "",
    });
    setEditProjId(p.id);
    setShowProjForm(true);
  }

  async function saveProject() {
    const supabase = createClient();
    const data = {
      title: projForm.title,
      title_en: projForm.title_en || null,
      description: projForm.description || null,
      description_en: projForm.description_en || null,
      status: projForm.status,
      progress: projForm.progress,
      start_date: projForm.start_date || null,
      end_date: projForm.end_date || null,
      funding_source: projForm.funding_source || null,
    };
    if (editProjId) {
      await supabase.from("research_projects").update(data).eq("id", editProjId);
    } else {
      await supabase.from("research_projects").insert(data);
    }
    resetProjForm();
    loadData();
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const supabase = createClient();
    await supabase.from("research_projects").delete().eq("id", id);
    loadData();
  }

  // Publication CRUD
  function resetPubForm() {
    setPubForm({
      title: "",
      authors: "",
      venue: "",
      year: new Date().getFullYear(),
      doi: "",
      url: "",
      pub_type: "journal",
      project_id: "",
      is_featured: false,
    });
    setShowPubForm(false);
    setEditPubId(null);
  }

  function startEditPub(p: Publication) {
    setPubForm({
      title: p.title,
      authors: p.authors,
      venue: p.venue ?? "",
      year: p.year,
      doi: p.doi ?? "",
      url: p.url ?? "",
      pub_type: p.pub_type,
      project_id: p.project_id ?? "",
      is_featured: p.is_featured,
    });
    setEditPubId(p.id);
    setShowPubForm(true);
  }

  async function savePub() {
    const supabase = createClient();
    const data = {
      title: pubForm.title,
      authors: pubForm.authors,
      venue: pubForm.venue || null,
      year: pubForm.year,
      doi: pubForm.doi || null,
      url: pubForm.url || null,
      pub_type: pubForm.pub_type,
      project_id: pubForm.project_id || null,
      is_featured: pubForm.is_featured,
    };
    if (editPubId) {
      await supabase.from("publications").update(data).eq("id", editPubId);
    } else {
      await supabase.from("publications").insert(data);
    }
    resetPubForm();
    loadData();
  }

  async function deletePub(id: string) {
    if (!confirm("Delete this publication?")) return;
    const supabase = createClient();
    await supabase.from("publications").delete().eq("id", id);
    loadData();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("admin.researchManagement")}</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setTab("projects")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${tab === "projects" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
        >
          {t("research.projects")}
        </button>
        <button
          onClick={() => setTab("publications")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${tab === "publications" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
        >
          {t("nav.publications")}
        </button>
      </div>

      {/* Projects Tab */}
      {tab === "projects" && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => {
                resetProjForm();
                setShowProjForm(true);
              }}
              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              {t("common.create")}
            </button>
          </div>

          {showProjForm && (
            <div className="mb-4 rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">
                  {editProjId ? t("common.edit") : t("common.create")}
                </h3>
                <button onClick={resetProjForm}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={projForm.title}
                  onChange={(e) =>
                    setProjForm({ ...projForm, title: e.target.value })
                  }
                  placeholder="Title (KO)"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={projForm.title_en}
                  onChange={(e) =>
                    setProjForm({ ...projForm, title_en: e.target.value })
                  }
                  placeholder="Title (EN)"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <select
                  value={projForm.status}
                  onChange={(e) =>
                    setProjForm({
                      ...projForm,
                      status: e.target.value as ProjectStatus,
                    })
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {t(`research.${s}`)}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <label className="text-sm">{t("research.progress")}:</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={projForm.progress}
                    onChange={(e) =>
                      setProjForm({
                        ...projForm,
                        progress: Number(e.target.value),
                      })
                    }
                    className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <span className="text-sm">%</span>
                </div>
                <input
                  type="date"
                  value={projForm.start_date}
                  onChange={(e) =>
                    setProjForm({ ...projForm, start_date: e.target.value })
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  type="date"
                  value={projForm.end_date}
                  onChange={(e) =>
                    setProjForm({ ...projForm, end_date: e.target.value })
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={projForm.funding_source}
                  onChange={(e) =>
                    setProjForm({ ...projForm, funding_source: e.target.value })
                  }
                  placeholder={t("research.fundingSource")}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <textarea
                  value={projForm.description}
                  onChange={(e) =>
                    setProjForm({ ...projForm, description: e.target.value })
                  }
                  placeholder="Description (KO)"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  rows={3}
                />
                <textarea
                  value={projForm.description_en}
                  onChange={(e) =>
                    setProjForm({
                      ...projForm,
                      description_en: e.target.value,
                    })
                  }
                  placeholder="Description (EN)"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  rows={3}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={saveProject}
                  className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  <Save className="h-4 w-4" />
                  {t("common.save")}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(`research.${p.status}`)} &middot; {p.progress}%
                    {p.funding_source && ` &middot; ${p.funding_source}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditProj(p)}
                    className="text-xs text-primary hover:underline"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications Tab */}
      {tab === "publications" && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => {
                resetPubForm();
                setShowPubForm(true);
              }}
              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              {t("common.create")}
            </button>
          </div>

          {showPubForm && (
            <div className="mb-4 rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">
                  {editPubId ? t("common.edit") : t("common.create")}
                </h3>
                <button onClick={resetPubForm}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={pubForm.title}
                  onChange={(e) =>
                    setPubForm({ ...pubForm, title: e.target.value })
                  }
                  placeholder="Title"
                  className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={pubForm.authors}
                  onChange={(e) =>
                    setPubForm({ ...pubForm, authors: e.target.value })
                  }
                  placeholder="Authors"
                  className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  value={pubForm.venue}
                  onChange={(e) =>
                    setPubForm({ ...pubForm, venue: e.target.value })
                  }
                  placeholder="Venue"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  value={pubForm.year}
                  onChange={(e) =>
                    setPubForm({ ...pubForm, year: Number(e.target.value) })
                  }
                  placeholder="Year"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <select
                  value={pubForm.pub_type}
                  onChange={(e) =>
                    setPubForm({
                      ...pubForm,
                      pub_type: e.target.value as PublicationType,
                    })
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {PUB_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
                <input
                  value={pubForm.doi}
                  onChange={(e) =>
                    setPubForm({ ...pubForm, doi: e.target.value })
                  }
                  placeholder="DOI"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <select
                  value={pubForm.project_id}
                  onChange={(e) =>
                    setPubForm({ ...pubForm, project_id: e.target.value })
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="">No project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={pubForm.is_featured}
                    onChange={(e) =>
                      setPubForm({ ...pubForm, is_featured: e.target.checked })
                    }
                  />
                  Featured
                </label>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={savePub}
                  className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  <Save className="h-4 w-4" />
                  {t("common.save")}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {publications.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.authors} &middot; {p.venue} &middot; {p.year}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditPub(p)}
                    className="text-xs text-primary hover:underline"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => deletePub(p.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
