"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { BookOpen,Menu,X,ChevronDown,LogOut,UserRound,Sun,Moon } from "lucide-react";
import { getUser,saveUser } from "@/lib/store";
import type { User } from "@/lib/types";
import { useRouter } from "next/navigation";
export default function Navbar(){
 const [user,setUser]=useState<User|null>(null),[open,setOpen]=useState(false),[menu,setMenu]=useState(false),[dark,setDark]=useState(false);
 const router=useRouter();
 useEffect(()=>{setUser(getUser());setDark(document.documentElement.classList.contains("dark")); const sync=()=>setUser(getUser()); window.addEventListener("storage",sync); return()=>window.removeEventListener("storage",sync)},[]);
 function toggleTheme(){const next=!dark;setDark(next);document.documentElement.classList.toggle("dark",next);localStorage.setItem("booknook_theme",next?"dark":"light")}
 function logout(){saveUser(null);setUser(null);setOpen(false);router.push("/")}
 const links=[["Home","/"],["All Books","/books"]];
 return <header className="nav-shell"><nav className="container nav-inner">
  <Link href="/" className="brand"><span className="brand-mark"><BookOpen size={21}/></span><span>booknook<span className="brand-dot">.</span></span></Link>
  <div className="desktop-links">{links.map(([n,h])=><Link key={h} href={h}>{n}</Link>)}{user&&<><Link href="/add-book">Add Book</Link><Link href="/my-books">My Books</Link><Link href="/my-borrows">My Borrows</Link></>}</div>
  <div className="nav-actions"><button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
  {user?<div className="profile-wrap"><button className="profile-trigger" onClick={()=>setOpen(!open)}><img src={user.photoURL||"https://i.pravatar.cc/80?img=12"} alt="" /><span>{user.name.split(" ")[0]}</span><ChevronDown size={15}/></button>{open&&<div className="profile-menu"><div className="profile-meta"><b>{user.name}</b><small>{user.email}</small></div><Link href="/profile" onClick={()=>setOpen(false)}><UserRound size={16}/> My Profile</Link><button onClick={logout}><LogOut size={16}/> Logout</button></div>}</div>:<div className="auth-actions"><Link className="btn btn-ghost btn-small" href="/login">Log in</Link><Link className="btn btn-primary btn-small" href="/register">Join free <span>↗</span></Link></div>}
  <button className="mobile-menu-btn" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?<X/>:<Menu/>}</button></div>
  {menu&&<div className="mobile-menu">{[...links,...(user?[["Add Book","/add-book"],["My Books","/my-books"],["My Borrows","/my-borrows"]]:[])].map(([n,h])=><Link onClick={()=>setMenu(false)} href={h} key={h}>{n}</Link>)}{!user&&<><Link href="/login">Log in</Link><Link href="/register">Register</Link></>}</div>}
 </nav></header>
}
