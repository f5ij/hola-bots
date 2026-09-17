import {Router} from "express";
import db from "./db.js";
import {current,audit} from "./auth.js";
export const router=Router();
function guard(req,res,next){const u=current(req);if(!u)return res.status(401).json({error:'غير مسجل الدخول'});if(u.role!=='Owner')return res.status(403).json({error:'للـOwner فقط'});req.user=u;next()}
router.use(guard);
router.get('/users',(req,res)=>res.json(db.prepare('SELECT id,discord_id,username,avatar,role,permissions,blocked,created_at FROM users ORDER BY id').all()));
router.patch('/users/:id',(req,res)=>{const t=db.prepare('SELECT * FROM users WHERE id=?').get(req.params.id);if(!t)return res.status(404).json({error:'المستخدم غير موجود'});db.prepare('UPDATE users SET role=?,permissions=?,blocked=? WHERE id=?').run(req.body.role||t.role,JSON.stringify(req.body.permissions||JSON.parse(t.permissions||'[]')),req.body.blocked?1:t.blocked,t.id);audit(req.user,'Role/Permission Changed',`تعديل ${t.username}`);res.json({ok:true})});
router.get('/events',(req,res)=>res.json(db.prepare('SELECT e.*,u.username FROM events e LEFT JOIN users u ON u.id=e.actor_id ORDER BY e.id DESC LIMIT 500').all()));
router.get('/warnings',(req,res)=>res.json(db.prepare('SELECT * FROM warnings ORDER BY id DESC LIMIT 500').all()));
router.get('/summary',(req,res)=>res.json({users:db.prepare('SELECT COUNT(*) c FROM users').get().c,bots:db.prepare('SELECT COUNT(*) c FROM bots').get().c,events:db.prepare('SELECT COUNT(*) c FROM events').get().c,warnings:db.prepare("SELECT COUNT(*) c FROM warnings WHERE status='open'").get().c}));