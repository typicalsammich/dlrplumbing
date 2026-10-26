import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?files(path.join(dir,d.name)):[path.join(dir,d.name)]);}
const html=files('dist').filter(x=>x.endsWith('.html'));const titles=new Set(),heads=new Set();let links=0;
for(const file of html){const s=fs.readFileSync(file,'utf8');assert.equal((s.match(/<h1[ >]/g)||[]).length,1,file+' must have one H1');const title=s.match(/<title>(.*?)<\/title>/s)[1];assert(!titles.has(title),'duplicate title');titles.add(title);const head=s.match(/<h1[^>]*>(.*?)<\/h1>/s)[1];assert(!heads.has(head),'duplicate H1');heads.add(head);assert(s.includes('name="description"'),file+' description');assert(s.includes('rel="canonical"'),file+' canonical');
for(const m of s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(m[1]);
for(const m of s.matchAll(/(?:href|src)="(\/[^"]*)"/g)){const url=m[1].split(/[?#]/)[0];const local=path.join('dist',decodeURIComponent(url));assert(fs.existsSync(local),file+' missing '+url);links++;}
for(const m of s.matchAll(/href="#([^"]+)"/g))assert(s.includes('id="'+m[1]+'"'),file+' missing anchor '+m[1]);
assert(s.includes('tel:+19512385089'));assert(s.includes('1162406'));
}
assert.equal(html.length,80);assert.equal(fs.readdirSync('dist/services',{withFileTypes:true}).filter(x=>x.isDirectory()).length,11);
assert.equal(JSON.parse(fs.readFileSync('dist/assets/cinematic-manifest.json')).enabled,true);
assert.equal(JSON.parse(fs.readFileSync('dist/assets/projects.json')).length,0);
const locations=JSON.parse(fs.readFileSync('cities-geodata.json'));assert.equal(locations.length,52);for(const c of locations){const city=fs.readFileSync('dist/service-areas/'+c.slug+'/index.html','utf8');assert(city.includes('Local source:'));assert(city.includes('city-map'));const nav=city.match(/<nav[\s\S]*?<\/nav>/)[0];for(const other of locations)assert(nav.includes('/service-areas/'+other.slug+'/'),'Missing dropdown location '+other.name);}
for(const variant of ['desktop','mobile']){assert(fs.statSync('dist/assets/entrance-'+variant+'.mp4').size>100000);assert(fs.statSync('dist/assets/hero-final-'+variant+'.webp').size>10000);}
for(const file of html)assert(!/[↗↓]/.test(fs.readFileSync(file,'utf8')),'Decorative arrow remains in '+file);
assert(fs.readFileSync('dist/service-areas/index.html','utf8').includes('coverage-map'));
assert(fs.readFileSync('dist/404.html','utf8').includes('noindex,follow'));
console.log('PASS: '+html.length+' HTML pages, '+links+' local references, unique H1s/titles, JSON-LD, all 11 services, safe media defaults.');

