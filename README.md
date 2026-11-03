# BookNook – A Small Online Library

A responsive, contemporary creative library frontend built with Next.js App Router, TypeScript and Tailwind CSS.

## Features
- Responsive home page with a three-slide Swiper hero and new-arrival book cards.
- Browse and search the full book collection with category filters.
- Book detail pages with availability and a borrow confirmation flow.
- Demo registration/login UI and protected-page redirects.
- Add, edit and delete books in the personal collection.
- Track borrowed books and return them, with copy counts updated in the demo data.
- Toast notifications, loading states, custom not-found page and page-specific titles.
- Reusable components and a service layer designed for later Express/MongoDB integration.
- Warm cream palette with coral, lavender and butter-yellow accents.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Demo note
This frontend currently uses browser localStorage and sample data to demonstrate interactions. Authentication is a frontend demo only; it is not secure and does not replace BetterAuth or server-side JWT verification. Connect the API service layer to the Express backend and implement BetterAuth before production use.

## Live site
Add your deployed URL here after hosting.
