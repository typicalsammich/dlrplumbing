export class CinematicEntrance {
constructor({root,hero,force=false}){this.force=force;this.root=root;this.hero=hero;this.state='initializing';this.controller=new AbortController();this.timers=new Set();this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.storageKey='dlr-entrance-seen';this.setState('initializing');}
setState(value){this.state=value;this.root.dataset.state=value;}
seen(){try{return sessionStorage.getItem(this.storageKey)==='1';}catch{return false;}}
remember(){try{sessionStorage.setItem(this.storageKey,'1');}catch{}}
later(fn,ms){const id=setTimeout(()=>{this.timers.delete(id);fn();},ms);this.timers.add(id);return id;}
async init(){
if(this.reduced.matches||navigator.connection?.saveData||['slow-2g','2g'].includes(navigator.connection?.effectiveType)||(!this.force&&this.seen())){this.setState('fallback');return;}
try{
const res=await fetch('/assets/cinematic-manifest.json',{signal:AbortSignal.timeout(1800)});if(!res.ok)throw Error('manifest');const config=await res.json();this.config=config;
const mobile=matchMedia('(max-width:800px)').matches;this.mobile=mobile;const media=mobile?config.mobile:config.desktop;
if(!config.enabled||!media?.sources?.length||!media.finalFrame){this.setState('fallback');return;}
this.media=media;
await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{this.finalImage=image;resolve();};image.onerror=reject;image.src=media.finalFrame;this.later(()=>reject(Error('still timeout')),1800);});
if(this.reduced.matches){this.setState('fallback');return;}
this.setState('ready');this.prepare();
}catch{this.finish('fallback',false);}
}
prepare(){
const layer=document.createElement('div');layer.className='entrance-layer';layer.setAttribute('role','region');layer.setAttribute('aria-label','The Invisible Infrastructure cinematic entrance');
layer.style.backgroundImage='url("'+this.media.finalFrame+'")';layer.style.backgroundSize='cover';layer.style.backgroundPosition=this.media.objectPosition||'center';
const video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.playsInline=true;video.preload='auto';video.setAttribute('aria-hidden','true');video.style.setProperty('--video-position',this.media.objectPosition||'center');
for(const source of this.media.sources){const s=document.createElement('source');s.src=source.src;s.type=source.type;video.append(s);}
const controls=document.createElement('div');controls.className='entrance-controls';const skip=document.createElement('button');skip.textContent='Skip intro';skip.addEventListener('click',()=>this.finish('skipped',false));controls.append(skip);
if(this.config.hasAudio){const sound=document.createElement('button');sound.textContent='Enable sound';sound.setAttribute('aria-pressed','false');sound.addEventListener('click',()=>{video.muted=!video.muted;sound.textContent=video.muted?'Enable sound':'Mute sound';sound.setAttribute('aria-pressed',String(!video.muted));});controls.prepend(sound);}
layer.append(video,controls);this.video=video;this.layer=layer;this.skip=skip;
const signal=this.controller.signal;
video.addEventListener('loadedmetadata',()=>{this.root.dataset.duration=String(video.duration);},{signal});
video.addEventListener('canplay',()=>{if(this.finished||this.started)return;this.started=true;video.play().catch(()=>this.finish('fallback',false));},{signal});
video.addEventListener('playing',()=>{
if(this.finished)return;
if(this.state==='playing')return;
if(window.scrollY>120){this.finish('fallback',false);return;}this.setState('playing');const bounds=this.hero.getBoundingClientRect();video.style.position='absolute';video.style.top=bounds.top+'px';video.style.left=bounds.left+'px';video.style.width=bounds.width+'px';video.style.height=bounds.height+'px';layer.style.backgroundImage='none';this.root.append(layer);document.body.classList.add('intro-active');this.locked=true;
const pic=this.hero.querySelector('picture');pic.querySelectorAll('source').forEach(s=>s.remove());const image=pic.querySelector('img');image.src=this.media.finalFrame;image.style.objectPosition=this.media.objectPosition||'center';
this.hero.style.backgroundImage='url("'+this.media.finalFrame+'")';this.hero.style.backgroundSize='cover';skip.focus({preventScroll:true});
this.stallTimer=this.later(()=>this.finish('fallback',false),15000);
},{signal});
video.addEventListener('ended',()=>this.finish('completed',true),{signal});
video.addEventListener('error',()=>this.finish('fallback',false),{signal});
video.addEventListener('timeupdate',()=>{if(this.finished)return;if(video.duration&&video.duration-video.currentTime<=.7)this.finish('completed',true);},{signal});
video.addEventListener('waiting',()=>{this.waitTimer=this.later(()=>this.finish('fallback',false),1800);},{signal});
video.addEventListener('canplay',()=>{if(this.waitTimer){clearTimeout(this.waitTimer);this.timers.delete(this.waitTimer);}},{signal});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&this.state==='playing')this.finish('skipped',false);},{signal});
window.addEventListener('pagehide',()=>this.destroy(),{signal});window.addEventListener('resize',()=>{if(this.locked)this.finish('skipped',false);},{signal});
this.reduced.addEventListener('change',e=>{if(e.matches)this.finish('fallback',false);},{signal});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.locked)this.finish('skipped',false);if(e.key==='Tab'&&this.locked){const items=[...controls.querySelectorAll('button')];if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus();}}},{signal});
this.loadTimer=this.later(()=>{if(!this.locked)this.finish('fallback',false);},4000);
video.load();
}
finish(final='completed',fade=true){
if(this.finished)return;this.finished=true;this.timers.forEach(clearTimeout);this.timers.clear();
const focusWasInside=!!this.layer?.contains(document.activeElement);this.video?.pause();if(this.video)this.video.muted=true;
if(this.locked)this.remember();
document.body.classList.remove('intro-active');this.locked=false;this.controller.abort();
if(this.layer&&fade){this.setState('transitioning');this.layer.classList.add('leaving');setTimeout(()=>{this.layer?.remove();this.releaseVideo();this.setState(final);},700);}
else{this.layer?.remove();this.releaseVideo();this.setState(final);}
if(focusWasInside){const heading=this.hero.querySelector('h1');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});}
}
releaseVideo(){if(!this.video)return;this.video.removeAttribute('src');this.video.querySelectorAll('source').forEach(s=>s.remove());this.video.load();}
destroy(){this.finish('skipped',false);this.layer?.remove();document.body.classList.remove('intro-active');}
}


