import Dashboard from '@/components/Dashboard';

export default function Home(){
 if(process.env.VERCEL_ENV==='preview' && process.env.BIDVERSE_PREVIEW_MODE==='demo-only'){
  return <main style={{minHeight:'100svh',display:'grid',placeItems:'center',background:'linear-gradient(140deg,#f3f6fb,#e8eff9)',color:'#17315d',padding:24}}>
   <section style={{width:'min(100%,560px)',background:'#fff',borderRadius:24,padding:'clamp(25px,5vw,48px)',boxShadow:'0 16px 50px #17315d18',border:'1px solid #dce6f4'}}>
    <div style={{fontSize:12,fontWeight:800,letterSpacing:3,color:'#a27943'}}>BIDVERSE · SIGNATURE EDITION</div>
    <h1 style={{fontSize:'clamp(28px,5vw,44px)',lineHeight:1.15,margin:'22px 0 14px'}}>UI preview. No live data.</h1>
    <p style={{lineHeight:1.7,color:'#667a99',margin:'0 0 26px'}}>This is a preview build for design and regression review. It is deliberately disconnected from production Supabase. Sign-in and real bidding are unavailable until an isolated staging backend is configured.</p>
    <a href="/demo" style={{display:'inline-block',textDecoration:'none',background:'#17315d',color:'#fff',padding:'14px 20px',borderRadius:12,fontWeight:700}}>Explore interactive demo →</a>
    <p style={{fontSize:12,color:'#7c8ca1',marginTop:28}}>Do not use this preview for auction acceptance tests.</p>
   </section>
  </main>;
 }
 return <Dashboard/>;
}
