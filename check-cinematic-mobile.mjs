import assert from 'node:assert/strict';
import {CinematicEntrance} from './dist/assets/cinematic.js';
class Classes{constructor(){this.values=new Set();}add(x){this.values.add(x);}remove(x){this.values.delete(x);}contains(x){return this.values.has(x);}}
class Node extends EventTarget{
constructor(tag='div'){super();this.tag=tag;this.children=[];this.dataset={};this.style={setProperty(k,v){this[k]=v;}};this.classList=new Classes();this.isConnected=false;this.hidden=false;this.playCalls=0;this.paused=true;}
setAttribute(k,v){this[k]=v;}removeAttribute(k){delete this[k];}
append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);n.connect(this.isConnected);}}
connect(value){this.isConnected=value;this.children.forEach(n=>n.connect(value));}
contains(node){return this===node||this.children.some(n=>n.contains(node));}
remove(){this.parent?.children.splice(this.parent.children.indexOf(this),1);this.connect(false);}
querySelectorAll(selector){return this.children.flatMap(n=>[...(n.tag===selector?[n]:[]),...n.querySelectorAll(selector)]);}
focus(){document.activeElement=this;}
load(){if(this.children.some(n=>n.tag==='source'))assert(this.isConnected,'Safari regression: load on detached video');}
play(){assert(this.isConnected,'Safari regression: play on detached video');this.playCalls++;if(!gesture)return Promise.reject(Object.assign(Error('tap needed'),{name:'NotAllowedError'}));this.paused=false;return Promise.resolve();}
pause(){this.paused=true;}
}
let gesture=false,seen=false;const replay=new Node('button');const body=new Node('body');
globalThis.document=Object.assign(new EventTarget(),{body,activeElement:null,createElement:tag=>new Node(tag),getElementById:()=>null,querySelector:()=>replay});
globalThis.window=Object.assign(new EventTarget(),{innerWidth:390,innerHeight:844,scrollY:0});
globalThis.matchMedia=query=>Object.assign(new EventTarget(),{matches:query.includes('max-width')});
Object.defineProperty(globalThis,'navigator',{value:{connection:{}},configurable:true});
globalThis.sessionStorage={getItem:()=>seen?'1':null,setItem:()=>{seen=true;}};
const config={enabled:true,hasAudio:false,desktop:{sources:[{src:'desktop.mp4',type:'video/mp4'}],finalFrame:'desktop.webp'},mobile:{sources:[{src:'mobile.mp4',type:'video/mp4'}],finalFrame:'mobile.webp'}};
function setup(force=false){const root=new Node();root.connect(true);const heading=new Node('h1');const hero={getBoundingClientRect:()=>({top:128,left:0,width:390,height:790}),querySelector:s=>s==='h1'?heading:null};return new CinematicEntrance({root,hero,force,config});}
const auto=setup();await auto.init();await Promise.resolve();assert.equal(auto.state,'blocked');assert(auto.video.isConnected);assert.equal(body.classList.contains('intro-active'),false);assert.equal(replay.textContent,'Play the entrance');
gesture=true;const before=auto.video.playCalls;assert.equal(auto.playFromGesture(),true);assert.equal(auto.video.playCalls,before+1,'Tap must call play synchronously');auto.video.dispatchEvent(new Event('playing'));assert.equal(auto.state,'playing');assert(body.classList.contains('intro-active'));assert.equal(auto.video.playsInline,true);assert.equal(auto.video['webkit-playsinline'],'');
window.innerHeight=740;window.dispatchEvent(new Event('resize'));assert.equal(auto.state,'playing','Toolbar-only height resize must not stop playback');assert.equal(auto.video.paused,false);
auto.finish('skipped',false);assert.equal(auto.video.paused,true);assert.equal(body.classList.contains('intro-active'),false);assert.equal(auto.state,'skipped');assert.equal(auto.timers.size,0);auto.finish('completed',true);assert.equal(auto.state,'skipped');
const explicit=setup(true);const ready=explicit.init();assert.equal(explicit.video.playCalls,1,'First manual replay must retain gesture without awaiting fetch or image');await ready;explicit.video.dispatchEvent(new Event('playing'));window.innerWidth=844;window.dispatchEvent(new Event('resize'));assert.equal(explicit.state,'skipped','Orientation width change exits cleanly');assert.equal(body.classList.contains('intro-active'),false);
console.log('PASS: connected-before-load/play, blocked autoplay recovery, synchronous tap/replay, inline attributes, toolbar resize, orientation cleanup, skip and scroll unlock.');
