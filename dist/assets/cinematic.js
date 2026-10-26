export class CinematicEntrance {
constructor({root,hero,force=false,config=null}){this.root=root;this.hero=hero;this.force=force;this.config=config;this.controller=new AbortController();this.timers=new Set();this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.storageKey='dlr-entrance-seen';this.setState('initializing');}
setState(state){this.state=state;this.root.dataset.state=state;}
seen(){try{return sessionStorage.getItem(this.storageKey)==='1';}catch{return false;}}
remember(){try{sessionStorage.setItem(this.storageKey,'1');}catch{}}
later(fn,ms){const id=setTimeout(()=>{this.timers.delete(id);fn();},ms);this.timers.add(id);return id;}
clearTimer(id){if(id!==undefined){clearTimeout(id);this.timers.delete(id);}}
async init(){
if(this.reduced.matches||(!this.force&&(navigator.connection?.saveData||['slow-2g','2g'].includes(navigator.connection?.effectiveType)||this.seen()))){this.setState('fallback');return;}
try{
if(!this.config){const inline=document.getElementById?.('cinematic-config');if(inline)this.config=JSON.parse(inline.textContent);}
if(!this.config){const res=await fetch('/assets/cinematic-manifest.json',{signal:AbortSignal.timeout(6000)});if(!res.ok)throw Error('manifest unavailable');this.config=await res.json();}
if(this.finished)return;
this.mobile=matchMedia('(max-width:800px)').matches;this.media=this.mobile?this.config.mobile:this.config.desktop;
if(!this.config.enabled||!this.media?.sources?.length||!this.media.finalFrame){this.setState('fallback');return;}
this.setState('ready');this.prepare();this.tryPlay(this.force);
}catch{this.finish('fallback',false);}
}
prepare(){
const signal=this.controller.signal;
const layer=document.createElement('div');layer.className='entrance-layer entrance-staged';layer.setAttribute('role','region');layer.setAttribute('aria-label','The Invisible Infrastructure cinematic entrance');
const video=document.createElement('video');
video.muted=true;video.defaultMuted=true;video.playsInline=true;video.preload='auto';video.autoplay=!this.force;video.disablePictureInPicture=true;
video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');video.setAttribute('aria-hidden','true');video.poster=this.media.finalFrame;video.style.setProperty('--video-position',this.media.objectPosition||'center');
for(const source of this.media.sources){const s=document.createElement('source');s.src=source.src;s.type=source.type;video.append(s);}
const controls=document.createElement('div');controls.className='entrance-controls';
const play=document.createElement('button');play.textContent='Play intro';play.hidden=true;play.addEventListener('click',()=>this.playFromGesture());
const skip=document.createElement('button');skip.textContent='Skip intro';skip.addEventListener('click',()=>this.finish('skipped',false));controls.append(play,skip);
this.video=video;this.layer=layer;this.skip=skip;this.playControl=play;this.controls=controls;
layer.append(video,controls);
video.addEventListener('loadedmetadata',()=>{this.root.dataset.duration=String(video.duration);},{signal});
video.addEventListener('playing',()=>this.onPlaying(),{signal});
video.addEventListener('ended',()=>this.finish('completed',true),{signal});
video.addEventListener('error',()=>this.finish('fallback',false),{signal});
video.addEventListener('timeupdate',()=>{if(this.finished)return;if(video.duration&&video.duration-video.currentTime<=.7)this.finish('completed',true);},{signal});
video.addEventListener('waiting',()=>{if(!this.locked)return;this.clearTimer(this.waitTimer);this.waitTimer=this.later(()=>this.finish('fallback',false),8000);},{signal});
video.addEventListener('canplay',()=>this.clearTimer(this.waitTimer),{signal});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&this.locked)this.finish('skipped',false);},{signal});
window.addEventListener('pagehide',()=>this.destroy(),{signal});
window.addEventListener('resize',()=>{if(!this.locked)return;if(Math.abs(window.innerWidth-this.playbackWidth)>40){this.finish('skipped',false);return;}this.layoutVideo();},{signal});
this.reduced.addEventListener('change',e=>{if(e.matches&&this.locked)this.finish('skipped',false);},{signal});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.locked)this.finish('skipped',false);if(e.key==='Tab'&&this.locked){const items=[...controls.querySelectorAll('button')].filter(b=>!b.hidden);if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus();}}},{signal});
// Attach the visible, inline video before loading or invoking play(). Never
// wait for canplay on a detached element and never defer a user-tap play().
this.root.append(layer);video.load();
}
tryPlay(fromGesture=false){
if(this.finished||!this.video)return;
this.setState('loading');this.playControl.hidden=true;
this.clearTimer(this.loadTimer);this.loadTimer=this.later(()=>{if(!this.locked)this.finish('fallback',false);},12000);
let attempt;try{attempt=this.video.play();}catch(error){this.playRejected(error);return;}
Promise.resolve(attempt).catch(error=>this.playRejected(error));
}
playFromGesture(){if(this.finished||!this.video)return false;this.force=true;this.tryPlay(true);return true;}
playRejected(error){
if(this.finished)return;this.clearTimer(this.loadTimer);
if(error?.name==='NotAllowedError'||error?.name==='AbortError'){
this.setState('blocked');this.playControl.hidden=false;
const replay=document.querySelector?.('.replay-entrance');if(replay)replay.textContent='Play the entrance';
if(this.locked)this.playControl.focus({preventScroll:true});
}else this.finish('fallback',false);
}
layoutVideo(){
const b=this.hero.getBoundingClientRect();
Object.assign(this.video.style,{position:'absolute',top:b.top+'px',left:b.left+'px',width:b.width+'px',height:b.height+'px'});
}
onPlaying(){
if(this.finished)return;
this.clearTimer(this.loadTimer);this.clearTimer(this.waitTimer);
if(this.locked)return;
if(!this.force&&window.scrollY>120){this.finish('fallback',false);return;}
this.setState('playing');this.playbackWidth=window.innerWidth;this.layoutVideo();
this.layer.classList.remove('entrance-staged');document.body.classList.add('intro-active');this.locked=true;this.playControl.hidden=true;
const picture=this.hero.querySelector('picture');if(picture){picture.querySelectorAll('source').forEach(s=>s.remove());const img=picture.querySelector('img');if(img){img.src=this.media.finalFrame;img.style.objectPosition=this.media.objectPosition||'center';}}
this.skip.focus({preventScroll:true});this.endTimer=this.later(()=>this.finish('fallback',false),30000);
}
finish(final='completed',fade=true){
if(this.finished)return;this.finished=true;this.timers.forEach(clearTimeout);this.timers.clear();
const focused=!!this.layer?.contains(document.activeElement);
this.video?.pause();if(this.video)this.video.muted=true;
if(this.locked&&(final==='completed'||final==='skipped'))this.remember();
document.body.classList.remove('intro-active');this.locked=false;this.controller.abort();
const replay=document.querySelector?.('.replay-entrance');if(replay)replay.textContent='Watch the entrance';
if(this.layer&&fade){this.setState('transitioning');this.layer.classList.add('leaving');this.fadeTimer=setTimeout(()=>{this.layer?.remove();this.releaseVideo();this.setState(final);},700);}
else{this.layer?.remove();this.releaseVideo();this.setState(final);}
if(focused){const h=this.hero.querySelector('h1');h?.setAttribute('tabindex','-1');h?.focus({preventScroll:true});}
}
releaseVideo(){if(!this.video)return;this.video.removeAttribute('src');this.video.querySelectorAll('source').forEach(s=>s.remove());this.video.load();}
destroy(){this.finish('skipped',false);clearTimeout(this.fadeTimer);this.layer?.remove();this.releaseVideo();document.body.classList.remove('intro-active');}
}
