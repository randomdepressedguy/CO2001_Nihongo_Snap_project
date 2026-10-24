import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, newSessionToken, tokenHash } from '../lib/auth/password.ts';
import { validEmail, validPassword, safeReturnPath } from '../lib/auth/validation.ts';
import { selectInitialState } from '../lib/study/sync.ts';
import { defaultState } from '../lib/study/core.ts';

test('password hashing uses distinct salts, rejects wrong passwords, and preserves Unicode', async () => {
  const password='Một mật khẩu đủ dài 日本語';
  const first=await hashPassword(password); const second=await hashPassword(password);
  assert.notEqual(first,second); assert.ok(!first.includes(password));
  assert.ok(await verifyPassword(password,first));
  assert.ok(!await verifyPassword('Not the same password',first));
  assert.ok(!await verifyPassword(password,null));
  assert.ok(!await verifyPassword(password,'invalid'));
});
test('session tokens are high entropy and stored by digest', () => {
  const one=newSessionToken(),two=newSessionToken(); assert.notEqual(one,two);
  assert.match(one,/^[a-f\d]{64}$/); assert.notEqual(tokenHash(one),one);
  assert.equal(tokenHash(one),tokenHash(one));
});
test('account fields and redirect targets are constrained', () => {
  assert.equal(validEmail('  Study@Example.com '),'study@example.com');
  assert.equal(validEmail('bad@example'),null); assert.equal(validEmail(null),null);
  assert.ok(validPassword('a long pass phrase'));assert.ok(!validPassword('short'));
  assert.equal(safeReturnPath('//evil.example/path'),'/account');
  assert.equal(safeReturnPath('/\\evil.example'),'/account');
  assert.equal(safeReturnPath('/login'),'/account');
  assert.equal(safeReturnPath('/review?deck=test'),'/review?deck=test');
});
test('cloud initialization loads account data while preserving unsynced local edits', () => {
  const local=defaultState();local.settings.name='local';const cloud=defaultState();cloud.settings.name='cloud';
  assert.equal(selectInitialState(local,{revision:2,pending:false},cloud,3).state,cloud);
  assert.equal(selectInitialState(local,{revision:2,pending:true},cloud,2).state,local);
  assert.equal(selectInitialState(local,{revision:2,pending:true},cloud,3).conflict,true);
  assert.equal(selectInitialState(local,{revision:null,pending:true},null,0).conflict,false);
  assert.equal(selectInitialState(local,{revision:null,pending:true},cloud,1).conflict,true);
});
