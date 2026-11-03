
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

import Protected from "@/components/protected";
import Modal from "@/components/modal";
import { getBooks, getUser, deleteBook } from "@/lib/store";
import type { Book } from "@/lib/types";

export default function MyBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selected, setSelected] = useState<Book | null>(null);
  const router = useRouter();

  function refresh() {
    const u = getUser();
    setBooks(getBooks().filter((b) => b.addedByEmail === u?.email));
  }

  useEffect(() => refresh(), []);

  function remove() {
    if (!selected) return;

    deleteBook(selected.id);
    toast.success("Book removed from your shelf.");
    setSelected(null);
    refresh();
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
                Manage the books you’ve shared with the community.
              </p>
            </div>

            <Link href="/add-book" className="btn btn-primary">
              <Plus size={16} /> Add a book
            </Link>
          </div>

          {books.length ? (
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
                      <td>{new Date(b.addedAt).toLocaleDateString()}</td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="small-action"
                            onClick={() => router.push(`/edit-book/${b.id}`)}
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
