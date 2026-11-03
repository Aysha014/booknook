"use client";
import { Toaster } from "react-hot-toast";
export default function Providers({children}:{children:React.ReactNode}){
 return <>{children}<Toaster position="top-right" toastOptions={{duration:3000,style:{borderRadius:"14px",background:"#292638",color:"#fff",fontSize:"14px"}}}/></>;
}
