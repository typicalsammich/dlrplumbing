export async function initLocations(){
const $=s=>document.querySelector(s);
if(!window.L){await new Promise((resolve,reject)=>{const script=document.querySelector('script[src*="leaflet.js"]');if(!script)return reject(Error('Map library missing'));const timer=setTimeout(()=>reject(Error('Map library timeout')),5000);script.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});script.addEventListener('error',reject,{once:true});});}
const L=window.L,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const make=(id,center,zoom)=>{const map=L.map(id,{scrollWheelZoom:false,zoomControl:true,attributionControl:true}).setView(center,zoom);let errors=0;const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
tiles.on('tileerror',()=>{errors++;if(errors===3&&$('#map-status'))$('#map-status').textContent='Some street-map tiles could not load. Location markers and the full city directory remain available.';});
new ResizeObserver(()=>map.invalidateSize({pan:false})).observe(document.getElementById(id));return map;};
const local=$('#city-map');
if(local){const lat=Number(local.dataset.lat),lng=Number(local.dataset.lng);const map=make('city-map',[lat,lng],11);L.circleMarker([lat,lng],{radius:8,color:'#fff',weight:2,fillColor:'#d52a35',fillOpacity:1}).addTo(map).bindTooltip(local.dataset.city,{permanent:true,direction:'top'});return;}
const data=JSON.parse($('#locations-data').textContent),map=make('coverage-map',[33.78,-117.4],8),markers=new Map();
const region=$('#region'),search=$('#city-search'),cities=$('#cities'),info=$('#city-info');let selected='menifee';
function select(city,move=true){
selected=city.slug;cities.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.slug===selected)));
markers.forEach((m,slug)=>m.setStyle({radius:slug===selected?9:5,color:slug===selected?'#fff':'#07182e',weight:slug===selected?3:1.5,fillColor:slug===selected?'#d52a35':'#087ddb',fillOpacity:1}));const marker=markers.get(city.slug);marker?.bringToFront().openTooltip();
info.replaceChildren();const tag=document.createElement('p');tag.className='eyebrow';tag.textContent=city.region;const h=document.createElement('h3');h.textContent=city.name;const p=document.createElement('p');p.textContent=city.headline+' Read the local service guide for official utility resources and practical plumbing guidance.';
const links=document.createElement('div');links.className='city-actions';const a=document.createElement('a');a.className='button navy';a.href='/service-areas/'+city.slug+'/';a.textContent=city.name+' service guide';const call=document.createElement('a');call.className='text-link';call.href='tel:+19512385089';call.textContent='Call to discuss your address';links.append(a,call);info.append(tag,h,p,links);
if(move)map.setView([city.lat,city.lng],Math.max(map.getZoom(),10),{animate:!reduce,duration:.5});
}
data.forEach(city=>{const m=L.circleMarker([city.lat,city.lng],{radius:5,color:'#07182e',weight:1.5,fillColor:'#087ddb',fillOpacity:1}).addTo(map).bindTooltip(city.name,{direction:'top'});
m.on('click',()=>select(city));const el=m.getElement();if(el){el.setAttribute('tabindex','0');el.setAttribute('role','button');el.setAttribute('aria-label','Select '+city.name);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(city);}});}markers.set(city.slug,m);});
function render(fit=true){
const query=search.value.trim().toLowerCase();const list=data.filter(c=>(query?c.name.toLowerCase().includes(query):(region.value==='all'||c.region===region.value)));
cities.replaceChildren();list.forEach(city=>{const b=document.createElement('button');b.dataset.slug=city.slug;b.textContent=city.name;b.setAttribute('aria-pressed',String(city.slug===selected));b.addEventListener('click',()=>select(city));cities.append(b);});
if(!list.length){const p=document.createElement('p');p.textContent='No matching location. Call to ask about your address.';cities.append(p);info.replaceChildren();return;}
select(list.find(c=>c.slug===selected)||list[0],false);
if(fit)map.fitBounds(L.latLngBounds(list.map(c=>[c.lat,c.lng])),{padding:[35,35],maxZoom:list.length===1?11:10,animate:!reduce});
}
search.addEventListener('input',()=>render());region.addEventListener('change',()=>{search.value='';render();});render(false);
}
