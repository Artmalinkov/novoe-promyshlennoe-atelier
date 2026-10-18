const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'../dist'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate HTML or SVG IDs');
assert.equal((html.match(/<h1\b/g)||[]).length,1,'Exactly one main heading');
for(const [,ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 if(ref.startsWith('#'))assert(ids.includes(ref.slice(1)),ref);
 else if(!/^(?:https?:|mailto:|tel:|data:)/.test(ref))assert(fs.existsSync(path.join(root,ref.split('?')[0])),ref);
}
assert(ids.includes('thermal')&&ids.includes('transport'));
assert.equal((html.match(/class="assembly-frame"/g)||[]).length,6);
assert(!html.includes('class="monogram"'),'Use the approved AM image');
console.log('PASS: local assets, anchors, unique IDs, one h1, two interactive sections and six assembly states.');
