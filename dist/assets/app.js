import {CinematicEntrance} from './cinematic.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const menu=$('.menu-toggle'),nav=$('#navigation');
function closeMenu(){document.body.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');}
menu?.addEventListener('click',()=>{const on=menu.getAttribute('aria-expanded')!=='true';document.body.classList.toggle('menu-open',on);menu.setAttribute('aria-expanded',String(on));menu.setAttribute('aria-label',on?'Close navigation':'Open navigation');});
document.addEventListener('keydown',e=>{
if(e.key==='Escape'){const open=$('details.dropdown[open]');if(open){open.open=false;open.querySelector('summary').focus();}else if(document.body.classList.contains('menu-open')){closeMenu();menu.focus();}}
if(e.key==='Tab'&&document.body.classList.contains('menu-open')){
const list=[menu,...nav.querySelectorAll('a,summary')].filter(x=>x.getClientRects().length);
if(e.shiftKey&&document.activeElement===list[0]){e.preventDefault();list.at(-1).focus();}
else if(!e.shiftKey&&document.activeElement===list.at(-1)){e.preventDefault();list[0].focus();}
}
});
$$('details.dropdown').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('details.dropdown').forEach(other=>{if(other!==d)other.open=false;});}));
document.addEventListener('click',e=>{if(!e.target.closest('.dropdown'))$$('details.dropdown').forEach(x=>x.open=false);});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
matchMedia('(min-width:801px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const sticky=$('.mobile-call'),hero=$('.hero,.inner-hero');
function scrolled(){document.body.classList.toggle('scrolled',scrollY>35);sticky?.classList.toggle('show',scrollY>(hero?hero.offsetTop+hero.offsetHeight-100:350));}
addEventListener('scroll',scrolled,{passive:true});scrolled();
const systemInfo=[
['WATER SUPPLY','A reliable system.<br>From the line to the tap.','Explore pipe repairs, repiping, and filtration for the supply side of your home.','repiping-and-pipe-repairs','Explore pipe services'],
['DRAINAGE','Keep everyday life<br>moving freely.','Slow sinks and recurring clogs need the right diagnosis. Explore drain clearing and related inspection services.','drain-clearing','Explore drain clearing'],
['WATER HEATING','Comfort starts<br>with reliable hot water.','Understand heater symptoms, repair considerations, replacement, and maintenance.','water-heaters','Explore water heaters'],
['FIXTURES','The details<br>you touch every day.','From a kitchen faucet to bathroom connections, consider fit, operation, and repair.','faucets-and-fixtures','Explore faucets & fixtures'],
['LEAK DETECTION','Find the source.<br>Plan the repair.','Damp surfaces and unexplained water use can warrant investigation. Learn how observations guide the next step.','leak-detection','Explore leak detection'],
['SEWER INSPECTION','See inside.<br>Decide with clarity.','A camera can assess visible conditions in accessible piping. Understand both the findings and limitations.','sewer-camera-inspections','Explore camera inspections']];
$$('[data-system]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.system),s=systemInfo[i];$$('[data-system]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.system===b.dataset.system)));$('#system-info').innerHTML='<p class="eyebrow">0'+(i+1)+' / '+s[0]+'</p><h3>'+s[1]+'</h3><p>'+s[2]+'</p><a class="text-link" href="/services/'+s[3]+'/">'+s[4]+' </a>';$('[data-network]').dataset.active=s[0].toLowerCase().replaceAll(' ','-');}));
$$('[data-selector]').forEach(tool=>{const data=JSON.parse(tool.querySelector('.choice-data').textContent);tool.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{tool.querySelectorAll('[data-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));tool.querySelector('.choice-result').textContent=data[Number(b.dataset.choice)];}));});
$('#obstruction')?.addEventListener('input',e=>{$('#drain-block').style.width=e.target.value+'%';$('#drain-output').textContent=e.target.value+'% illustrative obstruction. The actual cause requires assessment.';});
if($('#coverage-map')||$('#city-map')){import('./locations-map.js').then(m=>m.initLocations()).catch(()=>{if($('#map-status'))$('#map-status').textContent+=' Interactive map unavailable; use the location directory below.';});}
const form=$('#inquiry-form');
if(form){
const params=new URLSearchParams(location.search);const requestedCity=params.get('city');if(requestedCity)form.elements.city.value=requestedCity;const service=params.get('service');if(service)[...form.elements.service.options].find(x=>x.value===service)&&(form.elements.service.value=service);
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity()||form.elements.website.value)return;
const fields=Object.fromEntries(new FormData(form));const status=$('#form-status');const submit=form.querySelector('[type=submit]');
if(form.dataset.endpoint){
submit.disabled=true;status.textContent='Sending inquiry…';
try{const u=new URL(form.dataset.endpoint,location.origin);if(u.protocol!=='https:'&&u.hostname!=='localhost')throw Error('Invalid endpoint');
const response=await fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,consent:true}),signal:AbortSignal.timeout(15000)});const result=await response.json();if(!response.ok||result.ok!==true)throw Error('Submission not accepted');
status.textContent='Your inquiry was accepted. For urgent help, call directly.';form.reset();
}catch{status.textContent='Your inquiry could not be confirmed. Call (951) 238-5089 or email directly.';}finally{submit.disabled=false;}
return;
}
const text='Name: '+fields.name+'\nPhone: '+fields.phone+'\nEmail: '+fields.email+'\nCity: '+fields.city+'\nService: '+fields.service+'\nPreferred contact: '+fields.preferred+'\n\n'+fields.message;
$('#email-fallback').hidden=false;$('#email-fallback textarea').value=text;
status.textContent='Email prepared. Your inquiry has not been sent. Review and send it in your mail app, or copy the text below.';
location.href='mailto:dlrplumbingsolutions@gmail.com?subject='+encodeURIComponent('Plumbing inquiry — '+fields.service)+'&body='+encodeURIComponent(text);
});
}
const workLinks=[['Water heaters','water-heaters','Explore repairs, replacements, and installation considerations.'],['Drain & sewer','drain-clearing','Learn about recurring clogs and when inspection may help.'],['Repiping','repiping-and-pipe-repairs','Compare a focused repair with a broader system evaluation.'],['Fixtures','faucets-and-fixtures','Understand compatibility, connections, and installation.'],['Construction','new-construction-plumbing','Plan the path from rough-in to final connections.'],['Custom projects','custom-plumbing-solutions','Define goals, constraints, and a practical scope.']];
function workDetail(i){const x=workLinks[i];$('#work-detail').innerHTML='<h3>'+x[0]+'</h3><p>'+x[2]+'</p><a class="text-link" href="/services/'+x[1]+'/">Explore the service </a>';}
if($('#work-detail')){workDetail(0);$$('[data-work]').forEach(b=>b.addEventListener('click',()=>{$$('[data-work]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));workDetail(Number(b.dataset.work));}));}
async function projects(){
if(!$('#project-gallery'))return;
try{const r=await fetch('/assets/projects.json');if(!r.ok)return;const list=(await r.json()).filter(p=>p.verified===true&&p.images?.length);if(!list.length)return;$('.gallery-empty').hidden=true;
const dialog=$('#project-dialog');let opener;
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
for(const project of list){const b=document.createElement('button');b.className='project-card';const image=new Image();image.src=project.images[0].src;image.alt=project.images[0].alt;image.loading='lazy';const h=document.createElement('h3');h.textContent=project.title;b.append(image,h);
b.addEventListener('click',()=>{opener=b;const content=dialog.querySelector('.project-content');content.replaceChildren();const heading=document.createElement('h2');heading.textContent=project.title;const desc=document.createElement('p');desc.textContent=project.description;const img=new Image();img.src=project.images[0].src;img.alt=project.images[0].alt;const thumbs=document.createElement('div');thumbs.className='project-thumbnails';project.images.forEach((photo,i)=>{const btn=document.createElement('button');btn.textContent='Photo '+(i+1);btn.addEventListener('click',()=>{img.src=photo.src;img.alt=photo.alt;});thumbs.append(btn);});content.append(heading,desc,img,thumbs);dialog.showModal();});$('#project-gallery').append(b);}
}catch{}
}
projects();
if($('#cinematic-root')){const entrance=new CinematicEntrance({root:$('#cinematic-root'),hero:$('#homepage-hero')});entrance.init();window.dlrEntrance=entrance;$('.replay-entrance')?.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'instant'});window.dlrEntrance.destroy();const replay=new CinematicEntrance({root:$('#cinematic-root'),hero:$('#homepage-hero'),force:true});window.dlrEntrance=replay;replay.init();});}

