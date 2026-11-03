"use client";
import { seedBooks } from "./data";
import type { Book, Borrow, User } from "./types";
const BOOKS = "booknook_books_v1", BORROWS = "booknook_borrows_v1", USER = "booknook_user_v1";
function read<T>(key:string, fallback:T):T { if(typeof window==="undefined") return fallback; try { const v=localStorage.getItem(key); return v?JSON.parse(v) as T:fallback; } catch { return fallback; } }
function write<T>(key:string,value:T){ if(typeof window!=="undefined") localStorage.setItem(key,JSON.stringify(value)); }
export const getBooks=()=>read<Book[]>(BOOKS,seedBooks);
export const saveBooks=(v:Book[])=>write(BOOKS,v);
export const getBorrows=()=>read<Borrow[]>(BORROWS,[]);
export const saveBorrows=(v:Borrow[])=>write(BORROWS,v);
export const getUser=()=>read<User|null>(USER,null);
export const saveUser=(v:User|null)=>write(USER,v);
export const addBook=(book:Book)=>saveBooks([book,...getBooks()]);
export const updateBook=(book:Book)=>saveBooks(getBooks().map(b=>b.id===book.id?book:b));
export const deleteBook=(id:string)=>saveBooks(getBooks().filter(b=>b.id!==id));
export function borrowBook(book:Book,user:User,days=14){
 const books=getBooks(); const current=books.find(b=>b.id===book.id);
 if(!current || current.availableCopies<1) throw new Error("This book is currently unavailable.");
 const borrows=getBorrows();
 if(borrows.some(b=>b.bookId===book.id && b.userEmail===user.email)) throw new Error("You already have this book borrowed.");
 const now=new Date(), due=new Date(); due.setDate(due.getDate()+days);
 saveBooks(books.map(b=>b.id===book.id?{...b,availableCopies:b.availableCopies-1}:b));
 saveBorrows([{id:crypto.randomUUID(),bookId:book.id,bookTitle:book.title,bookImage:book.image,userEmail:user.email,borrowDate:now.toISOString(),returnDate:due.toISOString()},...borrows]);
}
export function returnBook(id:string){
 const borrow=getBorrows().find(b=>b.id===id); if(!borrow) return;
 saveBorrows(getBorrows().filter(b=>b.id!==id));
 saveBooks(getBooks().map(b=>b.id===borrow.bookId?{...b,availableCopies:Math.min(b.totalCopies,b.availableCopies+1)}:b));
}
