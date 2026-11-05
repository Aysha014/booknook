
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/types";
import Modal from "@/components/modal";

export default function BookDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user ?? null;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Book not found."
              : "Failed to load book."
          );
        }

        const data: Book = await response.json();
        setBook(data);
      } catch (error) {
        setBook(null);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load book."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  async function borrow() {
    if (!sessionUser) {
      router.push(`/login?next=${encodeURIComponent(`/books/${id}`)}`);
      return;
    }

    if (!book || busy) return;

    try {
      setBusy(true);

      // Get JWT token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      // Borrow book with JWT authorization
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            bookId: book.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not borrow this book."
        );
      }

      setBook({
        ...book,
        availableCopies: book.availableCopies - 1,
      });

      toast.success("Book borrowed! Happy reading.");
      setModal(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not borrow this book."
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="page-loader">
        <span className="spinner" />
        Loading book…
      </div>
    );
  }

  if (!book) {
    return (
      <div className="page-loader">
        Book not found.
        <Link href="/books" className="text-link">
          Back to all books
        </Link>
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

              <div className="detail-author">
                by {book.author}
              </div>

              <p className="detail-description">
                {book.description}
              </p>

              <div className="detail-meta">
                <div className="meta-box">
                  <small>Available copies</small>
                  <b>
                    {book.availableCopies} of {book.totalCopies}
                  </b>
                </div>

                <div className="meta-box">
                  <small>Added on</small>
                  <b>
                    {new Date(book.addedAt).toLocaleDateString()}
                  </b>
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
                {book.availableCopies < 1 ? (
                  "Not Available"
                ) : (
                  <>
                    Borrow this book <BookOpen size={17} />
                  </>
                )}
              </button>

              <p className="form-help" style={{ marginTop: 12 }}>
                Borrowing period: 14 days. Please return on time
                so another reader can enjoy it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <Modal
          title="Borrow this book?"
          onClose={() => {
            if (!busy) setModal(false);
          }}
        >
          <p>
            You're about to borrow <b>{book.title}</b>. Your
            return date will be 14 days from today.
          </p>

          <div className="modal-actions">
            <button
              className="btn btn-ghost"
              disabled={busy}
              onClick={() => setModal(false)}
            >
              Not now
            </button>

            <button
              className="btn btn-primary"
              disabled={busy}
              onClick={borrow}
            >
              {busy ? "Borrowing…" : "Confirm borrow"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
