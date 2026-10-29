const PROD_HOST = 'zrzqwtciyaibdeuumaee.supabase.co';

export function deploymentErrors(env) {
 const stage=(env.VERCEL_ENV||'').trim();
 if(!['production','preview'].includes(stage)) return [];
 const errors=[];
 const rawUrl=(env.NEXT_PUBLIC_SUPABASE_URL||'').trim();
 const key=(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'').trim();
 let host='';
 try {const url=new URL(rawUrl);if(url.protocol!=='https:')errors.push('Supabase URL must use HTTPS');host=url.hostname.toLowerCase();}
 catch {errors.push('A valid NEXT_PUBLIC_SUPABASE_URL is required');}
 if(!key || /placeholder|your_publishable_key|change_me/i.test(key)) errors.push('A real Supabase publishable key is required');
 if(key.startsWith('sb_secret_')) errors.push('Never expose a Supabase secret key in NEXT_PUBLIC_ variables');
 if(stage==='production' && host && host!==PROD_HOST) errors.push('Production must use the approved BIDVERSE production Supabase project');
 if(stage==='preview' && host===PROD_HOST) errors.push('Preview must never connect to the production Supabase project');
 if(stage==='preview' && !rawUrl) errors.push('Preview requires a separate staging Supabase configuration');
 return errors;
}
