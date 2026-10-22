import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomBytes} from 'node:crypto';
import {defaultState,makeCard} from '../lib/study/core.ts';
import {WORDS} from '../lib/study/data.ts';
const require=createRequire(import.meta.url);
const {build}=require(require.resolve('esbuild',{paths:[require.resolve('wrangler/package.json')]}));
const {Miniflare}=require(require.resolve('miniflare',{paths:[require.resolve('wrangler/package.json')]}));

test('Worker authentication, session revocation, account isolation and optimistic sync', {timeout:60000},async()=>{
 const directory=await mkdtemp(join(tmpdir(),'nihongo-auth-test-'));const worker=join(directory,'worker.mjs');
 await build({entryPoints:['tests/fixtures/auth-worker.ts'],outfile:worker,bundle:true,platform:'node',format:'esm',external:['cloudflare:workers'],define:{'import.meta.env.DEV':'true'},logLevel:'silent'});
 const mf=new Miniflare({modules:true,script:await readFile(worker,'utf8'),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB']});
 try{
 const db=await mf.getD1Database('DB');
 for(const file of ['drizzle/0000_little_caretaker.sql','drizzle/0001_concerned_sally_floyd.sql']){const sql=await readFile(file,'utf8');for(const statement of sql.replaceAll('--> statement-breakpoint','').split(';').map(x=>x.trim()).filter(Boolean))await db.prepare(statement).run();}
 const password=randomBytes(24).toString('base64url');const email=`qa-${randomBytes(8).toString('hex')}@example.invalid`;
 const call=async(path,data,cookie='',origin='https://nihongo.test')=>{
  const response=await mf.dispatchFetch('https://nihongo.test'+path,{method:data===undefined?'GET':path==='/state'?'PUT':'POST',headers:{'Content-Type':'application/json',Origin:origin,Cookie:cookie},...(data===undefined?{}:{body:JSON.stringify(data)})});
  const json=await response.json();return{response,json,cookie:response.headers.get('set-cookie')?.split(';')[0]??''};
 };
 assert.equal((await call('/state')).response.status,401);
 assert.equal((await call('/register',{name:'QA',email,password},'','https://other.test')).response.status,403);
 assert.equal((await call('/register',{name:'QA',email,password:'short'})).response.status,400);
 const registered=await call('/register',{name:'QA learner',email,password});assert.equal(registered.response.status,201,JSON.stringify(registered.json));
 const cookie=registered.cookie;assert.match(registered.response.headers.get('set-cookie'),/HttpOnly; SameSite=Lax/);assert.ok(!JSON.stringify(registered.json).includes(password));
 assert.equal((await call('/session',undefined,cookie)).json.user.email,email);
 const row=await db.prepare('SELECT password_hash FROM app_accounts WHERE email=?').bind(email).first();assert.match(row.password_hash,/^scrypt\$/);assert.ok(!row.password_hash.includes(password));
 assert.equal((await call('/register',{name:'QA',email,password})).response.status,409);
 assert.equal((await call('/login',{email,password:'wrong password'})).response.status,401);
 const login=await call('/login',{email,password,remember:true});assert.equal(login.response.status,200);assert.notEqual(login.cookie,cookie);assert.match(login.response.headers.get('set-cookie'),/Max-Age=2592000/);
 const state=defaultState();state.cards=[makeCard(WORDS[0])];
 const saved=await call('/state',{revision:0,state},cookie);assert.equal(saved.response.status,200);assert.equal(saved.json.revision,1);
 assert.equal((await call('/state',undefined,cookie)).json.state.cards[0].jp,WORDS[0].jp);
 assert.equal((await call('/state',{revision:0,state},cookie)).response.status,409);
 const other=await call('/register',{name:'Other account',email:`other-${email}`,password});assert.equal(other.response.status,201);
 assert.equal((await call('/state',undefined,other.cookie)).json.state,null);
 assert.equal((await call('/profile',{name:'Updated name'},cookie)).response.status,200);
 assert.equal((await call('/session',undefined,cookie)).json.user.name,'Updated name');
 const newPassword=randomBytes(24).toString('base64url');
 assert.equal((await call('/password',{currentPassword:password,newPassword},cookie)).response.status,200);
 assert.equal((await call('/session',undefined,login.cookie)).json.user,null);
 assert.equal((await call('/state',undefined,cookie)).response.status,401);
 const fresh=await call('/login',{email,password:newPassword});assert.equal(fresh.response.status,200);
 assert.equal((await call('/state',undefined,fresh.cookie)).json.state.cards.length,1);
 assert.equal((await call('/logout',{},fresh.cookie)).response.status,200);
 assert.equal((await call('/session',undefined,fresh.cookie)).json.user,null);
 for(let i=0;i<9;i++){const failed=await call('/login',{email:'missing@example.invalid',password});if(i===8)assert.equal(failed.response.status,429);}
 }finally{await mf.dispose();}
});
