import {NextResponse} from 'next/server';
export const dynamic='force-dynamic';
export function GET(){
 return NextResponse.json(
  {service:'bidverse',status:'ok',scope:'application-process-only',timestamp:new Date().toISOString()},
  {headers:{'Cache-Control':'no-store, max-age=0'}}
 );
}
