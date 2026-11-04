import { seedBooks } from "@/lib/data";
import BookDetailsClient from "./BookDetailsClient";

export function generateStaticParams() {
  return seedBooks.map((book) => ({
    id: String(book.id),
  }));
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookDetailsClient id={id} />;
}