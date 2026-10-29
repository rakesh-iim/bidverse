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

/** Do not allow destructive integration tests to run against the live BIDVERSE database. */
export function integrationTestErrors(env) {
 const errors = [];
 const rawUrl = (env.BIDVERSE_SUPABASE_URL || '').trim();
 let target;
 try { target = new URL(rawUrl); }
 catch { return ['Set a valid isolated staging Supabase URL before running live bid tests']; }
 if (target.protocol !== 'https:') errors.push('Live bid tests require HTTPS');
 const host = target.hostname.toLowerCase();
 if (host === PROD_HOST) errors.push('REFUSED: live bid integration tests cannot target BIDVERSE production');
 if (!host.endsWith('.supabase.co') || !/^[a-z0-9-]+\.supabase\.co$/.test(host)) errors.push('Live bid tests require an explicit Supabase project hostname');
 if (target.username || target.password || target.search || target.hash || target.pathname !== '/') errors.push('Use the staging project origin only, without paths or credentials');
 return errors;
}
