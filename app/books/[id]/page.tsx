// Server component — required for static export with dynamic routes.
// generateStaticParams returns [] because IDs are resolved at runtime in the browser.
export function generateStaticParams() {
  return [];
}

import BookDetailsClient from "./BookDetailsClient";

export default function BookDetailsPage() {
  return <BookDetailsClient />;
}
