import fs from 'node:fs';
import assert from 'node:assert/strict';
const f=['package.json','.env.example','server/db.js','server/auth.js','server/bots.js','server/admin.js','server/index.js','client/index.html','client/src/main.jsx','client/src/style.css'];
for(const x of f)assert.ok(fs.existsSync(x),`missing ${x}`);
const db=fs.readFileSync('server/db.js','utf8'),bot=fs.readFileSync('server/bots.js','utf8');
assert.match(db,/aes-256-gcm/);assert.match(db,/ENCRYPTION_KEY/);assert.match(bot,/encrypt\(botToken\)/);
assert.doesNotMatch(fs.readFileSync('client/src/main.jsx','utf8'),/localStorage.*botToken|botToken.*localStorage/i);
console.log('Hola Bots smoke test: PASS');