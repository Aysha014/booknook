import Link from "next/link";import {Home} from "lucide-react";
export default function NotFound(){return <div className="container not-found"><strong>404</strong><h1>Oops, this page wandered off.</h1><p>We couldn't find the page you were looking for. Maybe it's tucked between the shelves?</p><Link href="/" className="btn btn-primary"><Home size={16}/> Back to home</Link></div>}
