import {test} from 'node:test';
import assert from 'node:assert/strict';
import {deploymentErrors} from '../scripts/deployment-policy.mjs';

const production='https://zrzqwtciyaibdeuumaee.supabase.co';
const staging='https://staging-project.supabase.co';
const key='sb_publishable_testkey';

test('production requires configured URL and public key',()=>{
 const errors=deploymentErrors({VERCEL_ENV:'production'});
 assert.ok(errors.some(e=>e.includes('URL')));
 assert.ok(errors.some(e=>e.includes('publishable key')));
});
test('approved production project passes environment checks',()=>{
 assert.deepEqual(deploymentErrors({VERCEL_ENV:'production',NEXT_PUBLIC_SUPABASE_URL:production,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:key}),[]);
});
test('production rejects an unexpected project',()=>{
 const errors=deploymentErrors({VERCEL_ENV:'production',NEXT_PUBLIC_SUPABASE_URL:staging,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:key});
 assert.ok(errors.some(e=>e.includes('approved')));
});
test('preview rejects production database even with valid public key',()=>{
 const errors=deploymentErrors({VERCEL_ENV:'preview',NEXT_PUBLIC_SUPABASE_URL:production,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:key});
 assert.ok(errors.some(e=>e.includes('never connect')));
});
test('preview accepts a configured staging database',()=>{
 assert.deepEqual(deploymentErrors({VERCEL_ENV:'preview',NEXT_PUBLIC_SUPABASE_URL:staging,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:key}),[]);
});
test('client-visible secret keys are always rejected',()=>{
 const errors=deploymentErrors({VERCEL_ENV:'production',NEXT_PUBLIC_SUPABASE_URL:production,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_secret_unsafe'});
 assert.ok(errors.some(e=>e.includes('secret')));
});
test('CI and local builds do not require live credentials',()=>{
 assert.deepEqual(deploymentErrors({NEXT_PUBLIC_SUPABASE_URL:'https://example.supabase.co',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'placeholder-build-only'}),[]);
});
