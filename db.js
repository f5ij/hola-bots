import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
fs.mkdirSync("data",{recursive:true});
const db=new Database("data/hola-bots.sqlite");
db.pragma("journal_mode=WAL"); db.pragma("foreign_keys=ON");
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,discord_id TEXT UNIQUE NOT NULL,username TEXT NOT NULL,avatar TEXT,role TEXT NOT NULL DEFAULT 'Member',permissions TEXT NOT NULL DEFAULT '[]',blocked INTEGER NOT NULL DEFAULT 0,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS bots(id INTEGER PRIMARY KEY,owner_id INTEGER NOT NULL,name TEXT NOT NULL,client_id TEXT UNIQUE NOT NULL,token TEXT NOT NULL,category TEXT NOT NULL,description TEXT DEFAULT '',avatar TEXT DEFAULT '',status TEXT DEFAULT 'offline',created_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS bot_settings(bot_id INTEGER PRIMARY KEY,prefix TEXT DEFAULT '-',settings TEXT DEFAULT '{}',FOREIGN KEY(bot_id) REFERENCES bots(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS commands(id INTEGER PRIMARY KEY,bot_id INTEGER NOT NULL,name TEXT NOT NULL,enabled INTEGER DEFAULT 1,required_role TEXT DEFAULT '',required_permission TEXT DEFAULT '',response TEXT DEFAULT '',error_message TEXT DEFAULT '',cooldown INTEGER DEFAULT 0,logs INTEGER DEFAULT 1,allowed_channels TEXT DEFAULT '',custom INTEGER DEFAULT 0,UNIQUE(bot_id,name),FOREIGN KEY(bot_id) REFERENCES bots(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY,actor_id INTEGER,discord_id TEXT,bot_id INTEGER,type TEXT NOT NULL,details TEXT DEFAULT '',severity TEXT DEFAULT 'info',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS warnings(id INTEGER PRIMARY KEY,user_discord_id TEXT NOT NULL,bot_id INTEGER,reason TEXT NOT NULL,details TEXT DEFAULT '',status TEXT DEFAULT 'open',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
`);
function key(){const k=process.env.ENCRYPTION_KEY||'';if(!/^[0-9a-fA-F]{64}$/.test(k))throw Error('ENCRYPTION_KEY must be 64 hex characters');return Buffer.from(k,'hex')}
export function encrypt(s){const iv=crypto.randomBytes(12),c=crypto.createCipheriv('aes-256-gcm',key(),iv),d=Buffer.concat([c.update(s,'utf8'),c.final()]);return [iv.toString('base64url'),c.getAuthTag().toString('base64url'),d.toString('base64url')].join('.')}
export function decrypt(s){const [iv,tag,d]=s.split('.'),c=crypto.createDecipheriv('aes-256-gcm',key(),Buffer.from(iv,'base64url'));c.setAuthTag(Buffer.from(tag,'base64url'));return Buffer.concat([c.update(Buffer.from(d,'base64url')),c.final()]).toString('utf8')}
export default db;