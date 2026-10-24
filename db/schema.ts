import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const studyState=sqliteTable('study_state',{userId:text('user_id').primaryKey(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(1),updatedAt:text('updated_at').notNull()});
export const aiUsage=sqliteTable('ai_usage',{key:text('key').primaryKey(),count:integer('count').notNull().default(0)});

export const appAccounts=sqliteTable('app_accounts',{id:text('id').primaryKey(),email:text('email').notNull().unique(),name:text('name').notNull(),passwordHash:text('password_hash').notNull(),createdAt:text('created_at').notNull()});
export const appSessions=sqliteTable('app_sessions',{tokenHash:text('token_hash').primaryKey(),accountId:text('account_id').notNull().references(()=>appAccounts.id,{onDelete:'cascade'}),expiresAt:integer('expires_at').notNull(),createdAt:integer('created_at').notNull()},t=>[index('app_sessions_account_idx').on(t.accountId),index('app_sessions_expiry_idx').on(t.expiresAt)]);
export const authThrottles=sqliteTable('auth_throttles',{key:text('key').primaryKey(),count:integer('count').notNull().default(0),expiresAt:integer('expires_at').notNull()});
