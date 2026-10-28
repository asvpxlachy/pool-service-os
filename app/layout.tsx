import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Pool Service OS',description:'Pool service technician prototype',appleWebApp:{capable:true,title:'Pool OS',statusBarStyle:'default'},manifest:'/manifest.webmanifest'};
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#f8fafc'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
