
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Protected from "@/components/protected";
import type { Category } from "@/lib/types";
import { authClient } from "@/lib/auth-client";

const categories: Category[] = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBook() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user ?? null;

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Fiction" as Category,
    description: "",
    totalCopies: "1",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  function change(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!sessionUser) return;

    if (!imageFile) {
      toast.error("Please select a book image.");
      return;
    }

    const totalCopies = Number(form.totalCopies);

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      toast.error("Add at least one valid copy.");
      return;
    }

    setBusy(true);

    try {
      // Get JWT token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      // Upload image to ImgBB
      const uploadFormData = new FormData();
      uploadFormData.append("image", imageFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || "Image upload failed.");
      }

      // Prepare book data
      const book = {
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category,
        image: uploadData.url,
        description: form.description.trim(),
        addedByName: sessionUser.name,
        addedAt: new Date().toISOString().slice(0, 10),
        totalCopies,
        availableCopies: totalCopies,
      };

      // Save book with JWT authorization
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify(book),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book.");
      }

      toast.success("Your book has been added!");
      router.push("/my-books");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not add book."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Protected>
      <div className="page-wrap">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">GIVE A BOOK A NEW HOME</span>
            <h1 className="page-title">Add to the bookshelf.</h1>
            <p className="page-intro">
              Share a book you love with the BookNook community.
            </p>
          </div>

          <form className="form-card" onSubmit={submit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Book title *</label>
                <input
                  className="field"
                  required
                  value={form.title}
                  onChange={(e) => change("title", e.target.value)}
                  placeholder="e.g. The Midnight Library"
                />
              </div>

              <div className="form-group">
                <label>Author name *</label>
                <input
                  className="field"
                  required
                  value={form.author}
                  onChange={(e) => change("author", e.target.value)}
                  placeholder="Author's name"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  className="select-field"
                  value={form.category}
                  onChange={(e) => change("category", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Total copies *</label>
                <input
                  className="field"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={form.totalCopies}
                  onChange={(e) => change("totalCopies", e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Book image *</label>
                <input
                  className="field"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] || null)
                  }
                />
              </div>

              <div className="form-group full">
                <label>Short description *</label>
                <textarea
                  className="textarea-field"
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => change("description", e.target.value)}
                  placeholder="What is this book about?"
                />
              </div>

              <div className="form-group">
                <label>Your name</label>
                <input
                  className="field"
                  readOnly
                  value={sessionUser?.name || ""}
                />
              </div>

              <div className="form-group">
                <label>Your email</label>
                <input
                  className="field"
                  readOnly
                  value={sessionUser?.email || ""}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.back()}
              >
                Cancel
              </button>

              <button className="btn btn-primary" disabled={busy}>
                {busy ? "Uploading and adding…" : "Add book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Protected>
  );
}
