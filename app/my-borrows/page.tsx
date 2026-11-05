"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";
import Protected from "@/components/protected";
import { authClient } from "@/lib/auth-client";
import type { Borrow } from "@/lib/types";

export default function MyBorrows() {
  const [items, setItems] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  const { data: session } = authClient.useSession();
  const sessionUser = session?.user ?? null;

  async function refresh() {
    if (!sessionUser?.email) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows?userEmail=${encodeURIComponent(sessionUser.email)}`
      );

      if (!response.ok) throw new Error("Failed to load borrowed books.");

      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast.error("Could not load borrowed books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [sessionUser?.email]);

  async function giveBack(id: string) {
    try {
      setReturningId(id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not return book.");
      }

      toast.success("Book returned. Thank you!");
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not return book."
      );
    } finally {
      setReturningId(null);
    }
  }

  return (
    <Protected>
      <div className="page-wrap">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">YOUR CURRENT READS</span>
            <h1 className="page-title">My borrowed books</h1>
            <p className="page-intro">
              A little reminder of the stories you're enjoying right now.
            </p>
          </div>

          {loading ? (
            <p>Loading borrowed books...</p>
          ) : items.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrow date</th>
                    <th>Return date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className="table-book">
                          <img src={b.bookImage} alt="" />
                          {b.bookTitle}
                        </div>
                      </td>
                      <td>{new Date(b.borrowDate).toLocaleDateString()}</td>
                      <td>{new Date(b.returnDate).toLocaleDateString()}</td>
                      <td>
                        <span
                          className="category-tag"
                          style={{
                            position: "static",
                            display: "inline-block",
                            background: "var(--mint)",
                          }}
                        >
                          Borrowed
                        </span>
                      </td>
                      <td>
                        <button
                          className="small-action"
                          onClick={() => giveBack(b.id)}
                          disabled={returningId === b.id}
                        >
                          {returningId === b.id ? "Returning..." : "Return book"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><BookOpen /></div>
              <h3>No borrowed books yet</h3>
              <p>There are plenty of stories waiting for you on the shelves.</p>
              <Link href="/books" className="btn btn-primary">
                Browse books
              </Link>
            </div>
          )}
        </div>
      </div>
    </Protected>
  );
}