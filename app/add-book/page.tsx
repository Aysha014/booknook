"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Protected from "@/components/protected";
import { addBook, getBooks } from "@/lib/store";
import type { Category, Book } from "@/lib/types";
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
    image: "",
    description: "",
    totalCopies: "1",
  });
  const [busy, setBusy] = useState(false);

  function change(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionUser) return;
    if (Number(form.totalCopies) < 1) {
      toast.error("Add at least one copy.");
      return;
    }
    setBusy(true);
    const book: Book = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category,
      image: form.image.trim(),
      description: form.description.trim(),
      addedByName: sessionUser.name,
      addedByEmail: sessionUser.email,
      addedAt: new Date().toISOString().slice(0, 10),
      totalCopies: Number(form.totalCopies),
      availableCopies: Number(form.totalCopies),
    };
    addBook(book);
    toast.success("Your book has been added!");
    router.push("/my-books");
  }

  return (
    <Protected>
      <div className="page-wrap">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">GIVE A BOOK A NEW HOME</span>
            <h1 className="page-title">Add to the bookshelf.</h1>
            <p className="page-intro">Share a book you love with the BookNook community.</p>
          </div>
          <form className="form-card" onSubmit={submit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Book title *</label>
                <input className="field" required value={form.title} onChange={(e) => change("title", e.target.value)} placeholder="e.g. The Midnight Library" />
              </div>
              <div className="form-group">
                <label>Author name *</label>
                <input className="field" required value={form.author} onChange={(e) => change("author", e.target.value)} placeholder="Author's name" />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select className="select-field" value={form.category} onChange={(e) => change("category", e.target.value)}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Total copies *</label>
                <input className="field" type="number" min="1" required value={form.totalCopies} onChange={(e) => change("totalCopies", e.target.value)} />
              </div>
              <div className="form-group full">
                <label>Book image URL *</label>
                <input className="field" type="url" required value={form.image} onChange={(e) => change("image", e.target.value)} placeholder="Paste an image URL (ImgBB or Postimages)" />
                <span className="form-help">Image hosting upload can be connected when the backend is added.</span>
              </div>
              <div className="form-group full">
                <label>Short description *</label>
                <textarea className="textarea-field" required rows={5} value={form.description} onChange={(e) => change("description", e.target.value)} placeholder="What is this book about?" />
              </div>
              <div className="form-group">
                <label>Your name</label>
                <input className="field" readOnly value={sessionUser?.name || ""} />
              </div>
              <div className="form-group">
                <label>Your email</label>
                <input className="field" readOnly value={sessionUser?.email || ""} />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => router.back()}>Cancel</button>
              <button className="btn btn-primary" disabled={busy}>{busy ? "Adding…" : "Add book"}</button>
            </div>
          </form>
        </div>
      </div>
    </Protected>
  );
}
