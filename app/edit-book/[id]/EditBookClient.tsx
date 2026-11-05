
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Protected from "@/components/protected";
import { authClient } from "@/lib/auth-client";
import type { Book, Category } from "@/lib/types";

const cats: Category[] = ["Fiction", "Science", "History", "Kids", "Others"];

export default function EditBookClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user ?? null;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!sessionUser) return;

    async function fetchBook() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`
        );

        if (!response.ok) {
          setNotFound(true);
          return;
        }

        const data: Book = await response.json();

        if (data.addedByEmail !== sessionUser!.email) {
          setNotFound(true);
          return;
        }

        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error("Failed to load book.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id, sessionUser]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!book) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: book.title,
            author: book.author,
            category: book.category,
            image: book.image,
            description: book.description,
            totalCopies: book.totalCopies,
            availableCopies: book.availableCopies,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update book.");
      }

      toast.success("Book details updated.");
      router.push("/my-books");
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update book."
      );
    }
  }

  if (loading) {
    return (
      <Protected>
        <div className="page-wrap container">
          <div className="empty-state">
            <h3>Loading book...</h3>
          </div>
        </div>
      </Protected>
    );
  }

  if (notFound || !book) {
    return (
      <Protected>
        <div className="page-wrap container">
          <div className="empty-state">
            <h3>Book not found</h3>
            <button
              className="btn btn-ghost"
              onClick={() => router.push("/my-books")}
            >
              Back to my books
            </button>
          </div>
        </div>
      </Protected>
    );
  }

  return (
    <Protected>
      <div className="page-wrap">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">MAKE AN UPDATE</span>
            <h1 className="page-title">Edit book details</h1>
          </div>

          <form className="form-card" onSubmit={submit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Book title</label>
                <input
                  className="field"
                  required
                  value={book.title}
                  onChange={(e) =>
                    setBook({ ...book, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Author</label>
                <input
                  className="field"
                  required
                  value={book.author}
                  onChange={(e) =>
                    setBook({ ...book, author: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="select-field"
                  value={book.category}
                  onChange={(e) =>
                    setBook({
                      ...book,
                      category: e.target.value as Category,
                    })
                  }
                >
                  {cats.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Total copies</label>
                <input
                  className="field"
                  type="number"
                  min={book.totalCopies - book.availableCopies}
                  value={book.totalCopies}
                  onChange={(e) => {
                    const total = Number(e.target.value);
                    setBook({
                      ...book,
                      totalCopies: total,
                      availableCopies: Math.max(
                        0,
                        total - (book.totalCopies - book.availableCopies)
                      ),
                    });
                  }}
                />
              </div>

              <div className="form-group full">
                <label>Image URL</label>
                <input
                  className="field"
                  type="url"
                  required
                  value={book.image}
                  onChange={(e) =>
                    setBook({ ...book, image: e.target.value })
                  }
                />
              </div>

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  className="textarea-field"
                  rows={5}
                  required
                  value={book.description}
                  onChange={(e) =>
                    setBook({ ...book, description: e.target.value })
                  }
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

              <button className="btn btn-primary">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Protected>
  );
}
