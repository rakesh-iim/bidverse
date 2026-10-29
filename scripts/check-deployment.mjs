import {deploymentErrors} from './deployment-policy.mjs';
const errors=deploymentErrors(process.env);
if(errors.length){
 for(const message of errors) console.error('[BIDVERSE deployment check] '+message);
 process.exitCode=1;
}else if(process.env.VERCEL_ENV==='production'||process.env.VERCEL_ENV==='preview'){
 console.log('[BIDVERSE deployment check] Configuration validated for '+process.env.VERCEL_ENV);
}else{
 console.log('[BIDVERSE deployment check] Local/CI build: Vercel deployment checks skipped');
}
