"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";
import Protected from "@/components/protected";
import { getBorrows, returnBook } from "@/lib/store";
import { authClient } from "@/lib/auth-client";
import type { Borrow } from "@/lib/types";

export default function MyBorrows() {
  const [items, setItems] = useState<Borrow[]>([]);
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user ?? null;

  function refresh() {
    setItems(getBorrows().filter((b) => b.userEmail === sessionUser?.email));
  }

  useEffect(() => {
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUser?.email]);

  function giveBack(id: string) {
    returnBook(id);
    toast.success("Book returned. Thank you!");
    refresh();
  }

  return (
    <Protected>
      <div className="page-wrap">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">YOUR CURRENT READS</span>
            <h1 className="page-title">My borrowed books</h1>
            <p className="page-intro">A little reminder of the stories you're enjoying right now.</p>
          </div>
          {items.length ? (
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
                        <span className="category-tag" style={{ position: "static", display: "inline-block", background: "var(--mint)" }}>
                          Borrowed
                        </span>
                      </td>
                      <td>
                        <button className="small-action" onClick={() => giveBack(b.id)}>Return book</button>
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
              <Link href="/books" className="btn btn-primary">Browse books</Link>
            </div>
          )}
        </div>
      </div>
    </Protected>
  );
}
