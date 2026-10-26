import assert from 'node:assert/strict';
import { CinematicEntrance } from './dist/assets/cinematic.js';
let reduced=false, seen=false, storageDenied=false, fetchCount=0;
globalThis.matchMedia=()=>({matches:reduced,addEventListener(){}});
Object.defineProperty(globalThis,'navigator',{value:{connection:{}},configurable:true});
globalThis.sessionStorage={getItem(){if(storageDenied)throw Error('denied');return seen?'1':null;},setItem(){if(storageDenied)throw Error('denied');}};
globalThis.document={body:{classList:{remove(){}}},activeElement:null};
const create=()=>new CinematicEntrance({root:{dataset:{}},hero:{}});
globalThis.fetch=async()=>{fetchCount++;return {ok:true,json:async()=>({enabled:false})};};
let e=create();await e.init();assert.equal(e.state,'fallback');assert.equal(fetchCount,1);
reduced=true;e=create();await e.init();assert.equal(e.state,'fallback');assert.equal(fetchCount,1);reduced=false;
seen=true;e=create();await e.init();assert.equal(e.state,'fallback');assert.equal(fetchCount,1);seen=false;
navigator.connection.saveData=true;e=create();await e.init();assert.equal(e.state,'fallback');assert.equal(fetchCount,1);navigator.connection.saveData=false;
storageDenied=true;e=create();await e.init();assert.equal(e.state,'fallback');assert.equal(fetchCount,2);storageDenied=false;
globalThis.fetch=async()=>{throw Error('unavailable');};e=create();await e.init();assert.equal(e.state,'fallback');assert.equal(e.finished,true);
e.finish('skipped',false);assert.equal(e.state,'fallback');assert.equal(e.timers.size,0);
console.log('PASS: disabled manifest, reduced motion, returning session, save-data, blocked storage, fetch failure, and idempotent cleanup.');

