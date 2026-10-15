import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'BIDVERSE | Signature Edition',description:'Realtime hybrid auction management'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
