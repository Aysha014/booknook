// Server component — required for static export with dynamic routes.
// generateStaticParams returns [] because IDs are resolved at runtime in the browser.
export function generateStaticParams() {
  return [];
}

import EditBookClient from "./EditBookClient";

export default function EditBookPage() {
  return <EditBookClient />;
}
