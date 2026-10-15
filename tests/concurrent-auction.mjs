import assert from 'node:assert/strict';
const required=['BIDVERSE_SUPABASE_URL','BIDVERSE_ANON_KEY','BIDVERSE_TEST_LOT_ID','BIDVERSE_TEST_TEAM_A','BIDVERSE_TEST_TEAM_B','BIDVERSE_CAPTAIN_A_JWT','BIDVERSE_CAPTAIN_B_JWT'];
const missing=required.filter(k=>!process.env[k]);if(missing.length){console.error('Missing environment variables: '+missing.join(', '));process.exit(2)}
const env=process.env;const origin=env.BIDVERSE_SUPABASE_URL.replace(/\/$/,'');
const headers=jwt=>({'apikey':env.BIDVERSE_ANON_KEY,'Authorization':'Bearer '+jwt,'Content-Type':'application/json'});
async function call(path,jwt,opts={}){const r=await fetch(origin+'/rest/v1/'+path,{...opts,headers:{...headers(jwt),...opts.headers}});const text=await r.text();let payload;try{payload=JSON.parse(text)}catch{payload=text}return {status:r.status,ok:r.ok,payload}}
const a=env.BIDVERSE_CAPTAIN_A_JWT,b=env.BIDVERSE_CAPTAIN_B_JWT;
const read=await call('auction_lots?id=eq.'+encodeURIComponent(env.BIDVERSE_TEST_LOT_ID)+'&select=id,event_id,status,current_bid,version,bidding_closes_at,player_id',a);
assert(read.ok&&read.payload.length===1,'Test lot unavailable to captain A');const lot=read.payload[0];assert.equal(lot.status,'open','Test lot must be open');
assert(lot.bidding_closes_at==null||Date.parse(lot.bidding_closes_at)>Date.now()+5000,'Test deadline must allow >5 seconds');
const ev=await call('events?id=eq.'+lot.event_id+'&select=bid_increment',a);assert(ev.ok&&ev.payload.length,'Cannot read event increment');
const pl=await call('players?id=eq.'+lot.player_id+'&select=base_price',a);assert(pl.ok&&pl.payload.length,'Cannot read player base price');
const inc=ev.payload[0].bid_increment;const minimum=lot.current_bid==null?pl.payload[0].base_price:lot.current_bid+inc;
const starting=Math.max(minimum,inc);const amount=lot.current_bid==null?starting:starting+((inc-((starting-lot.current_bid)%inc))%inc);
function place(jwt,team,request){return call('rpc/submit_auction_bid',jwt,{method:'POST',body:JSON.stringify({p_lot:lot.id,p_team:team,p_amount:amount,p_source:'mobile',p_request:request})})}
const uuid=()=>crypto.randomUUID();
console.log('Testing lot '+lot.id+' at bid amount '+amount+' (both captains submit concurrently)');
const [one,two]=await Promise.all([place(a,env.BIDVERSE_TEST_TEAM_A,uuid()),place(b,env.BIDVERSE_TEST_TEAM_B,uuid())]);
const accepted=[one,two].filter(x=>x.ok);assert.equal(accepted.length,1,'Expected exactly one equal-price bid to be accepted; received '+JSON.stringify([one.status,two.status]));
const after=await call('auction_lots?id=eq.'+lot.id+'&select=current_bid,version,leading_team_id',a);
assert(after.ok&&after.payload.length===1,'Cannot inspect authoritative lot');
assert.equal(after.payload[0].current_bid,amount,'Winning bid mismatch');
assert.equal(after.payload[0].version,lot.version+1,'Exactly one lot revision must occur');
console.log('PASS: exactly one concurrent equal-price bid accepted and server state updated once');
console.log('Rejected bid HTTP status: '+[one,two].find(x=>!x.ok).status);
