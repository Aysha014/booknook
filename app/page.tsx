
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ArrowRight, Heart, RefreshCw, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

import Hero from "@/components/hero";
import SectionHeading from "@/components/section-heading";
import BookCard from "@/components/book-card";

import { getBooks } from "@/lib/store";
import { seedBooks } from "@/lib/data";
import type { Book } from "@/lib/types";

export default function Home() {
  const [books, setBooks] = useState<Book[]>(seedBooks);

  // Load latest six books
  useEffect(() => {
    const latestBooks = getBooks()
      .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
      .slice(0, 6);

    setBooks(latestBooks);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* New Arrivals Section */}
      <section className="section">
        <div className="container">
          <div className="section-top">
            <SectionHeading
              eyebrow="FRESH OFF THE SHELF"
              title="New arrivals"
              description="New stories have found their way to our shelves. Take a peek."
            />

            <Link href="/books" className="text-link">
              Explore all books
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="book-grid">
            {books.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>

          <div className="center-action">
            <Link href="/books" className="btn btn-ghost">
              See all books
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" id="how-it-works">
        <div className="container">
          <SectionHeading
            eyebrow="THAT'S THE MAGIC"
            title="A library that moves with you"
            description="Three little steps. A whole lot of reading joy."
            center
          />

          <div className="how-grid">
            {/* Step 1 */}
            <div className="how-card">
              <div className="how-icon">
                <Bookmark />
              </div>

              <h3>Find a book</h3>

              <p>
                Browse the shelves and discover something that
                speaks to you. There's always a new favorite waiting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="how-card">
              <div className="how-icon">
                <RefreshCw />
              </div>

              <h3>Borrow & enjoy</h3>

              <p>
                Borrow a book for a little while. Settle into a cozy
                corner and let the pages take you somewhere new.
              </p>
            </div>

            {/* Step 3 */}
            <div className="how-card">
              <div className="how-icon">
                <Heart />
              </div>

              <h3>Pass it along</h3>

              <p>
                Return your book so another curious reader can enjoy
                it. That's how a reading community grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="section" id="community">
        <div className="container">
          <div className="community-banner">
            <div>
              <span className="eyebrow">
                A SHELF IS BETTER WHEN IT'S SHARED
              </span>

              <h2>Have a book worth sharing?</h2>

              <p>
                Add it to BookNook and let another reader fall in love
                with it.
              </p>
            </div>

            <Link href="/add-book" className="btn btn-dark">
              Share a book
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
