import React from "react";
import {AbsoluteFill,Composition,Img,interpolate,useCurrentFrame,useVideoConfig,staticFile,Easing,Sequence} from "remotion";
type Props={mobile:boolean};
const easing=Easing.bezier(0.4,0,0.2,1);
const Film:React.FC<Props>=({mobile})=>{
const f=useCurrentFrame();const {fps,width,height}=useVideoConfig();const t=f/fps;
const keys=mobile?[0,1.8,3.5,5.5,7.2]:[0,1.8,3.5,5.5,7.2];
const scale=interpolate(t,keys,mobile?[1.08,1,1.05,1.9,1.75]:[1.35,1.28,1.05,2.25,2.05],{easing,extrapolateRight:"clamp"});
const cx=interpolate(t,keys,mobile?[.43,.46,.74,.805,.83]:[.37,.4,.54,.805,.83],{easing,extrapolateRight:"clamp"});
const cy=interpolate(t,keys,mobile?[.32,.35,.63,.72,.27]:[.34,.35,.52,.73,.29],{easing,extrapolateRight:"clamp"});
const baseScale=Math.max(width/1672,height/941);
const iw=1672*baseScale*scale,ih=941*baseScale*scale;
const x=Math.max(width-iw,Math.min(0,width/2-cx*iw)),y=Math.max(height-ih,Math.min(0,height/2-cy*ih));
const kitchenScale=interpolate(t,[7.2,9.4,10.5],[1.055,1,1],{easing,extrapolateLeft:"clamp",extrapolateRight:"clamp"});
const kb=Math.max(width/1672,height/941),kw=1672*kb*kitchenScale,kh=941*kb*kitchenScale;
const kx=mobile?Math.max(width-kw,Math.min(0,width*.64-kw*.73)):(width-kw)/2;
return <AbsoluteFill style={{backgroundColor:"#07182e",overflow:"hidden"}}>
<Sequence name="Exterior to hidden plumbing" from={0} durationInFrames={Math.round(7.25*fps)} premountFor={fps}>
<div style={{position:"absolute",left:x,top:y,width:iw,height:ih}}>
<Img src={staticFile("house.png")} style={{width:"100%",height:"100%"}}/>
<svg viewBox="0 0 1672 941" style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:interpolate(t,[3.4,4.3,6.3,7.1],[0,.18,.18,0])}}><path d="M1190 650L1395 625Q1425 621 1425 595L1425 340" fill="none" stroke="#c6eaff" strokeWidth="2.5" strokeDasharray="22 60" strokeDashoffset={-f*4}/></svg>
</div>
</Sequence>
<Sequence name="From foundation to faucet" from={Math.round(7.25*fps)} durationInFrames={Math.round(3.25*fps)} premountFor={fps}>
<div style={{position:"absolute",left:kx,top:(height-kh)/2,width:kw,height:kh}}>
<Img src={staticFile("kitchen.png")} style={{width:"100%",height:"100%"}}/>
<svg viewBox="0 0 1672 941" style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:t<9.5?.12:interpolate(t,[9.5,9.75],[.12,0],{extrapolateRight:"clamp"})}}><path d="M1180 351L1139 770" stroke="white" strokeWidth="14" fill="none" strokeDasharray="3 8 2 16 4 11" strokeDashoffset={-f*12}/></svg>
</div>
</Sequence>
</AbsoluteFill>;
};
export const MyComposition=()=> <><Composition id="InvisibleInfrastructureDesktop" component={Film} defaultProps={{mobile:false}} width={1440} height={810} fps={24} durationInFrames={252}/><Composition id="InvisibleInfrastructureMobile" component={Film} defaultProps={{mobile:true}} width={720} height={1280} fps={24} durationInFrames={252}/></>;

