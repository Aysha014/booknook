import BookDetailsClient from "./BookDetailsClient";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookDetailsClient id={id} />;
}