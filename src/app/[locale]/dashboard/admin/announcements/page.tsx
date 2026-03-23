"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save, Pin } from "lucide-react";
import type { Post, PostCategory } from "@/lib/types";

const CATEGORIES: PostCategory[] = ["notice", "general", "resource"];

export default function AdminAnnouncementsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "notice" as PostCategory,
    is_pinned: false,
    is_published: true,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("posts")
      .select("*, author:profiles(name)")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
  }

  function resetForm() {
    setForm({
      title: "",
      content: "",
      category: "notice",
      is_pinned: false,
      is_published: true,
    });
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(post: Post) {
    setForm({
      title: post.title,
      content: post.content,
      category: post.category,
      is_pinned: post.is_pinned,
      is_published: post.is_published,
    });
    setEditingId(post.id);
    setShowForm(true);
  }

  async function handleSave() {
    const supabase = createClient();
    const data = {
      title: form.title,
      content: form.content,
      category: form.category,
      is_pinned: form.is_pinned,
      is_published: form.is_published,
    };

    if (editingId) {
      await supabase.from("posts").update(data).eq("id", editingId);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase
        .from("posts")
        .insert({ ...data, author_id: user?.id });
    }

    resetForm();
    loadPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", id);
    loadPosts();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t("admin.announcementManagement")}
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          {t("posts.newPost")}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">
              {editingId ? t("posts.editPost") : t("posts.newPost")}
            </h3>
            <button onClick={resetForm}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Content (Markdown supported)"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              rows={10}
            />
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as PostCategory,
                  })
                }
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`posts.${c}`)}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_pinned}
                  onChange={(e) =>
                    setForm({ ...form, is_pinned: e.target.checked })
                  }
                />
                {t("posts.pinned")}
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) =>
                    setForm({ ...form, is_published: e.target.checked })
                  }
                />
                Published
              </label>
              <button
                onClick={handleSave}
                className="ml-auto flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <Save className="h-4 w-4" />
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {post.is_pinned && (
                  <Pin className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                  {t(`posts.${post.category}`)}
                </span>
                <span className="truncate font-medium">{post.title}</span>
                {!post.is_published && (
                  <span className="text-[10px] text-muted-foreground">
                    (Draft)
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString("ko-KR")} &middot;
                {t("posts.views")} {post.view_count}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(post)}
                className="text-xs text-primary hover:underline"
              >
                {t("common.edit")}
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No posts</p>
        )}
      </div>
    </div>
  );
}
