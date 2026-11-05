"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

import Protected from "@/components/protected";
import Modal from "@/components/modal";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/types";

export default function MyBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selected, setSelected] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user ?? null;

  useEffect(() => {
    async function fetchMyBooks() {
      if (!sessionUser?.email) {
        setBooks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }

        const data: Book[] = await response.json();

        const myBooks = data.filter(
          (book) => book.addedByEmail === sessionUser.email
        );

        setBooks(myBooks);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not load your books."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMyBooks();
  }, [sessionUser?.email]);


  async function remove() {
    if (!selected) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${selected.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book.");
      }

      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== selected.id)
      );

      toast.success("Book deleted successfully.");
      setSelected(null);
    } catch (error) {
      console.error("Error deleting book:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete book."
      );
    }
  }


  return (
    <Protected>
      <div className="page-wrap">
        <div className="container">
          <div className="section-top">
            <div className="page-head">
              <span className="eyebrow">YOUR CONTRIBUTION</span>
              <h1 className="page-title">My bookshelf</h1>
              <p className="page-intro">
                Manage the books you've shared with the community.
              </p>
            </div>

            <Link href="/add-book" className="btn btn-primary">
              <Plus size={16} /> Add a book
            </Link>
          </div>

          {loading ? (
            <div className="page-loader">
              <span className="spinner" />
              Loading your books…
            </div>
          ) : books.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Category</th>
                    <th>Copies</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className="table-book">
                          <img src={b.image} alt="" />
                          <span>
                            {b.title}
                            <small
                              style={{
                                display: "block",
                                color: "var(--muted)",
                                fontWeight: 400,
                                marginTop: 4,
                              }}
                            >
                              {b.author}
                            </small>
                          </span>
                        </div>
                      </td>

                      <td>{b.category}</td>

                      <td>
                        {b.availableCopies}/{b.totalCopies}
                      </td>

                      <td>
                        {new Date(b.addedAt).toLocaleDateString()}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="small-action"
                            onClick={() =>
                              router.push(`/edit-book/${b.id}`)
                            }
                          >
                            <Pencil size={13} /> Edit
                          </button>

                          <button
                            className="small-action danger"
                            onClick={() => setSelected(b)}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Plus />
              </div>
              <h3>Your shelf is waiting</h3>
              <p>Add your first book and share it with other readers.</p>
              <Link href="/add-book" className="btn btn-primary">
                Add your first book
              </Link>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <Modal
          title="Delete this book?"
          onClose={() => setSelected(null)}
        >
          <p>
            Are you sure you want to remove <b>{selected.title}</b>? This
            action cannot be undone.
          </p>

          <div className="modal-actions">
            <button
              className="btn btn-ghost"
              onClick={() => setSelected(null)}
            >
              Keep book
            </button>

            <button
              className="btn btn-primary"
              style={{ background: "#d9534f" }}
              onClick={remove}
            >
              Delete book
            </button>
          </div>
        </Modal>
      )}
    </Protected>
  );
}