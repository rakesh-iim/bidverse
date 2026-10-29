import assert from 'node:assert/strict';

const base=(process.env.BIDVERSE_SMOKE_URL||'http://127.0.0.1:3100').replace(/\/$/,'');
async function check(path,expected){
 const response=await fetch(base+path,{redirect:'manual'});
 assert.equal(response.status,200,path+' must return 200 (received '+response.status+')');
 const type=response.headers.get('content-type')||'';
 assert.match(type,expected,path+' returned unexpected content-type');
 console.log('PASS',path,response.status);
 return response;
}
const health=await check('/api/health',/application\/json/);
const body=await health.json();
assert.equal(body.service,'bidverse');
assert.equal(body.scope,'application-process-only');
const root=await check('/',/text\/html/);
assert.match(await root.text(),/BIDVERSE/i);
const demo=await check('/demo',/text\/html/);
assert.match(await demo.text(),/BIDVERSE/i);
await check('/premium-auction-gavel.svg',/image\/svg\+xml/);
console.log('Application routes and static asset responded; no database/auth tests were performed.');
