import Link from "next/link";
import {
  BookOpen,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Footer About */}
        <div className="footer-about">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <BookOpen size={21} />
            </span>

            <span>
              booknook<span className="brand-dot">.</span>
            </span>
          </Link>

          <p>
            A little corner of the internet for curious minds, good stories
            and books worth passing along.
          </p>

          <div className="socials">
            <a href="#" aria-label="Instagram">
              <Instagram size={17} />
            </a>

            <a href="#" aria-label="Facebook">
              <Facebook size={17} />
            </a>

            <a href="mailto:hello@booknook.com" aria-label="Email">
              <Mail size={17} />
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4>Explore</h4>

          <Link href="/books">Browse books</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#community">Our community</Link>
        </div>

        {/* User Links */}
        <div>
          <h4>Your bookshelf</h4>

          <Link href="/my-books">My books</Link>
          <Link href="/my-borrows">My borrows</Link>
          <Link href="/add-book">Share a book</Link>
        </div>

        {/* Contact Information */}
        <div>
          <h4>Say hello</h4>

          <p className="contact-line">
            <Mail size={15} />
            hello@booknook.com
          </p>

          <p className="contact-line">
            <MapPin size={15} />
            Made for readers everywhere
          </p>

          <a className="footer-contact" href="mailto:hello@booknook.com">
            Get in touch
            <ArrowUpRight size={15} />
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} BookNook. Made for the love of reading.
        </span>

        <span>
          Read more. Wonder more. <span className="heart">♥</span>
        </span>
      </div>
    </footer>
  );
}