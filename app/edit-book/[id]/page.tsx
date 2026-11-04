import { seedBooks } from "@/lib/data";
import EditBookClient from "./EditBookClient";

export function generateStaticParams() {
  return seedBooks.map((book) => ({
    id: String(book.id),
  }));
}

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditBookClient id={id} />;
}