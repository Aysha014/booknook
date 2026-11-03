export type Category = "Fiction" | "Science" | "History" | "Kids" | "Others";
export type Book = {
  id: string; title: string; author: string; category: Category; image: string;
  description: string; addedByName: string; addedByEmail: string; addedAt: string;
  totalCopies: number; availableCopies: number;
};
export type Borrow = {
  id: string; bookId: string; bookTitle: string; bookImage: string;
  userEmail: string; borrowDate: string; returnDate: string;
};
export type User = { name: string; email: string; photoURL: string };
