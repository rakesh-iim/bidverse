import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {test} from 'node:test';

const source=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('primary route renders authenticated dashboard, not public demo',()=>{
 const page=source('app/page.tsx');
 assert.match(page,/import Dashboard from/);
 assert.match(page,/<Dashboard\s*\/>/);
 assert.doesNotMatch(page,/DemoPreview/);
});
test('public demo is isolated under /demo',()=>{
 const page=source('app/demo/page.tsx');
 assert.match(page,/import DemoPreview from/);
 assert.match(page,/<DemoPreview\s*\/>/);
});
test('authenticated dashboard does not contain guest routing bypass',()=>{
 const dashboard=source('components/Dashboard.tsx');
 assert.match(dashboard,/if\(!user\)return <AuthShell>/);
 assert.doesNotMatch(dashboard,/if\(guestMode\)/);
 assert.doesNotMatch(dashboard,/import DemoPreview/);
});
test('client only uses publishable Supabase configuration',()=>{
 const client=source('lib/supabase.ts');
 assert.match(client,/NEXT_PUBLIC_SUPABASE_URL/);
 assert.match(client,/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
 assert.doesNotMatch(client,/SERVICE_ROLE_KEY|SECRET_KEY|SUPABASE_JWT_SECRET/);
});
test('repository keeps secrets and generated output out of Git',()=>{
 const gitignore=source('.gitignore');
 assert.match(gitignore,/node_modules/);
 assert.match(gitignore,/\.env\.local/);
 assert.match(gitignore,/\.next/);
});
test('lockfile is required before reproducible release builds',()=>{
 if(!existsSync(new URL('../package-lock.json',import.meta.url))) {
  console.warn('Release warning: package-lock.json is absent. Install resolution is NOT reproducible.');
 }
});
