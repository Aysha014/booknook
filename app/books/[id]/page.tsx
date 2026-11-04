"use client";

// Required for Next.js static export with dynamic routes.
// IDs are resolved at runtime in the browser (via useParams + localStorage).
export function generateStaticParams() {
  return [];
}
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

import { getBooks, getBorrows, borrowBook } from "@/lib/store";
import { seedBooks } from "@/lib/data";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/types";
import Modal from "@/components/modal";

export default function BookDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user ?? null;

  const [book, setBook] = useState<Book | null>(null);
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setBook(
      getBooks().find((b) => b.id === params.id) ||
        seedBooks.find((b) => b.id === params.id) ||
        null
    );
  }, [params.id]);

  function borrow() {
    if (!sessionUser) {
      router.push(`/login?next=${encodeURIComponent(`/books/${params.id}`)}`);
      return;
    }
    if (!book) return;
    try {
      setBusy(true);
      // borrowBook expects a User shape: { name, email, photoURL }
      borrowBook(book, { name: sessionUser.name, email: sessionUser.email, photoURL: sessionUser.image ?? "" });
      toast.success("Book borrowed! Happy reading.");
      setModal(false);
      setBook(getBooks().find((b) => b.id === book.id) || book);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not borrow this book.");
    } finally {
      setBusy(false);
    }
  }

  if (!book) {
    return (
      <div className="page-loader">
        <span className="spinner" />
        Loading book…
      </div>
    );
  }

  return (
    <>
      <div className="page-wrap">
        <div className="container">
          <Link href="/books" className="text-link">
            <ArrowLeft size={15} /> Back to all books
          </Link>
          <div className="detail-layout" style={{ marginTop: 25 }}>
            <div className="detail-image">
              <img src={book.image} alt={book.title} />
            </div>
            <div className="detail-info">
              <span className="eyebrow">{book.category}</span>
              <h1>{book.title}</h1>
              <div className="detail-author">by {book.author}</div>
              <p className="detail-description">{book.description}</p>
              <div className="detail-meta">
                <div className="meta-box">
                  <small>Available copies</small>
                  <b>{book.availableCopies} of {book.totalCopies}</b>
                </div>
                <div className="meta-box">
                  <small>Added on</small>
                  <b>{new Date(book.addedAt).toLocaleDateString()}</b>
                </div>
                <div className="meta-box">
                  <small>Added by</small>
                  <b>{book.addedByName}</b>
                </div>
                <div className="meta-box">
                  <small>Contact</small>
                  <b>{book.addedByEmail}</b>
                </div>
              </div>
              <button
                disabled={book.availableCopies < 1}
                className="btn btn-primary"
                onClick={() => setModal(true)}
              >
                {book.availableCopies < 1 ? "Not Available" : <><>Borrow this book </><BookOpen size={17} /></>}
              </button>
              <p className="form-help" style={{ marginTop: 12 }}>
                Borrowing period: 14 days. Please return on time so another reader can enjoy it.
              </p>
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <Modal title="Borrow this book?" onClose={() => setModal(false)}>
          <p>You're about to borrow <b>{book.title}</b>. Your return date will be 14 days from today.</p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Not now</button>
            <button className="btn btn-primary" disabled={busy} onClick={borrow}>
              {busy ? "Borrowing…" : "Confirm borrow"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
