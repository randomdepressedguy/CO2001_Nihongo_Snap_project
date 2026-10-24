import {env} from 'cloudflare:workers';
import {authAction} from '../../lib/auth/service';
import {sessionAccount} from '../../lib/auth/session';
import {readStudyState,writeStudyState} from '../../lib/study/server-state';
export default {async fetch(request:Request){
 const path=new URL(request.url).pathname;
 if(path==='/session')return Response.json({user:await sessionAccount(request,env.DB)});
 if(path==='/state'){const account=await sessionAccount(request,env.DB);const key=account?`account:${account.id}`:null;return request.method==='GET'?readStudyState(env.DB,key):writeStudyState(request,env.DB,key);}
 const action=path.slice(1) as 'login'|'register'|'logout'|'profile'|'password';
 return authAction(request,action);
}};
