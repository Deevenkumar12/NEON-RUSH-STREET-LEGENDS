"use strict";
var AU={ctx:null,vol:{m:.5,s:.85},prof:null,music:false};
var SND={i4:{f:50,r:3.6,h:2,lp:1600,d:2,rough:0},diesel:{f:30,r:2.8,h:1.5,lp:750,d:4,rough:13},thump:{f:26,r:3.2,h:1.5,lp:1000,d:5,rough:9},
i6:{f:58,r:4,h:2,lp:2200,d:3,rough:0},v8:{f:36,r:3.6,h:1.5,lp:1200,d:6,rough:7},v6t:{f:62,r:3.8,h:2,lp:2500,d:4,rough:0},
flat6:{f:70,r:4.2,h:3,lp:3200,d:3,rough:0},v10:{f:80,r:4.4,h:2,lp:4000,d:3,rough:0},bike:{f:98,r:4.2,h:2,lp:4800,d:2,rough:0}};
function distCurve(k){var a=new Float32Array(256);for(var i=0;i<256;i++){var x=i/128-1;a[i]=(1+k)*x/(1+k*Math.abs(x));}return a;}
AU.init=function(){
 if(AU.ctx){if(AU.ctx.state==="suspended")AU.ctx.resume();return;}
 try{var A=window.AudioContext||window.webkitAudioContext;if(!A)return;var x=AU.ctx=new A();
 AU.sfx=x.createGain();AU.sfx.gain.value=AU.vol.s;AU.sfx.connect(x.destination);
 AU.mus=x.createGain();AU.mus.gain.value=AU.vol.m*.35;AU.mus.connect(x.destination);
 var n=x.createBuffer(1,x.sampleRate*2,x.sampleRate),d=n.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.nb=n;
 var e=AU.e={};e.o1=x.createOscillator();e.o1.type="sawtooth";e.o2=x.createOscillator();e.o2.type="square";e.o3=x.createOscillator();e.o3.type="triangle";
 e.g1=x.createGain();e.g2=x.createGain();e.g3=x.createGain();e.g1.gain.value=.5;e.g2.gain.value=.22;e.g3.gain.value=.6;
 e.ws=x.createWaveShaper();e.lp=x.createBiquadFilter();e.lp.type="lowpass";e.out=x.createGain();e.out.gain.value=0;
 e.lfo=x.createOscillator();e.lg=x.createGain();e.lg.gain.value=0;e.lfo.connect(e.lg);e.lg.connect(e.out.gain);
 e.o1.connect(e.g1);e.o2.connect(e.g2);e.o3.connect(e.g3);e.g1.connect(e.ws);e.g2.connect(e.ws);e.g3.connect(e.ws);e.ws.connect(e.lp);e.lp.connect(e.out);e.out.connect(AU.sfx);
 e.o1.start();e.o2.start();e.o3.start();e.lfo.start();
 AU.loop=function(t,f,q){var s=x.createBufferSource();s.buffer=n;s.loop=true;var fl=x.createBiquadFilter();fl.type=t;fl.frequency.value=f;fl.Q.value=q;var g=x.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(AU.sfx);s.start();return g;};
 AU.skid=AU.loop("bandpass",1800,3);AU.wind=AU.loop("lowpass",700,.7);AU.rain=AU.loop("highpass",2600,.4);AU.nos=AU.loop("bandpass",1000,1.4);
 AU.setCar("i4");AU.music=true;AU.startMusic();
 }catch(err){AU.ctx=null;}
};
AU.setCar=function(k){if(!AU.ctx)return;var p=AU.prof=SND[k]||SND.i4,e=AU.e;e.ws.curve=distCurve(p.d*6);e.lg.gain.value=p.rough?.05:0;e.lfo.frequency.value=p.rough||1;};
AU.upd=function(rpm,th,spd,slip,nos,rain,on){
 if(!AU.ctx||!AU.prof)return;var p=AU.prof,e=AU.e,t=AU.ctx.currentTime,f=p.f*(1+rpm*p.r);
 e.o1.frequency.setTargetAtTime(f,t,.05);e.o2.frequency.setTargetAtTime(f*p.h,t,.05);e.o3.frequency.setTargetAtTime(f*.5,t,.05);
 e.lp.frequency.setTargetAtTime(p.lp*(.3+rpm*.9+th*.5),t,.06);
 e.out.gain.setTargetAtTime(on?.1+.14*th+.05*rpm:0,t,.08);
 AU.skid.gain.setTargetAtTime(on&&Math.abs(slip)>.45?.07*Math.min(1,spd*1.6):0,t,.08);
 AU.wind.gain.setTargetAtTime(on?.02+.12*spd*spd:0,t,.1);
 AU.rain.gain.setTargetAtTime(rain?.05:0,t,.3);AU.nos.gain.setTargetAtTime(on&&nos?.09:0,t,.05);
};
AU.silence=function(){if(AU.ctx)AU.upd(0,0,0,0,0,0,false);};
AU.tone=function(f,d,ty,v){if(!AU.ctx)return;var x=AU.ctx,o=x.createOscillator(),g=x.createGain(),t=x.currentTime;o.type=ty||"square";o.frequency.value=f;g.gain.setValueAtTime(v||.12,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AU.sfx);o.start();o.stop(t+d);};
AU.burst=function(f,d,v,ty){if(!AU.ctx)return;var x=AU.ctx,s=x.createBufferSource(),fl=x.createBiquadFilter(),g=x.createGain(),t=x.currentTime;s.buffer=AU.nb;fl.type=ty||"lowpass";fl.frequency.value=f;g.gain.setValueAtTime(v||.3,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl);fl.connect(g);g.connect(AU.sfx);s.start(t,Math.random());s.stop(t+d);};
AU.thud=function(){AU.burst(260,.3,.5);AU.tone(70,.25,"sine",.4);};
AU.pop=function(){AU.burst(1400,.08,.18,"bandpass");};
AU.fanfare=function(){[523,659,784,1046].forEach(function(f,i){setTimeout(function(){AU.tone(f,.3,"triangle",.15);},i*120);});};
AU.startMusic=function(){
 var x=AU.ctx,step=0,next=x.currentTime+.1,sp=60/112/4,B=[0,0,12,0,0,10,0,7,0,0,12,0,3,0,5,7],L=[0,3,7,12,7,3,10,7],root=55;
 setInterval(function(){if(!AU.music||x.state!=="running"||AU.vol.m<=0){next=x.currentTime+.1;return;}
  while(next<x.currentTime+.3){var s=step%16,bar=Math.floor(step/16)%4,tr=[0,0,-2,3][bar];
   if(s%4===0){var o=x.createOscillator(),g=x.createGain();o.frequency.setValueAtTime(130,next);o.frequency.exponentialRampToValueAtTime(40,next+.12);g.gain.setValueAtTime(.5,next);g.gain.exponentialRampToValueAtTime(.001,next+.16);o.connect(g);g.connect(AU.mus);o.start(next);o.stop(next+.18);}
   if(s%2===1){var b=x.createBufferSource(),f=x.createBiquadFilter(),g2=x.createGain();b.buffer=AU.nb;f.type="highpass";f.frequency.value=7000;g2.gain.setValueAtTime(.12,next);g2.gain.exponentialRampToValueAtTime(.001,next+.05);b.connect(f);f.connect(g2);g2.connect(AU.mus);b.start(next);b.stop(next+.06);}
   var q=B[s]+tr;if(B[s]>=0&&(s%2===0||s===13)){var o2=x.createOscillator(),lp=x.createBiquadFilter(),g3=x.createGain();o2.type="sawtooth";o2.frequency.value=root*Math.pow(2,q/12);lp.type="lowpass";lp.frequency.value=700;g3.gain.setValueAtTime(.35,next);g3.gain.exponentialRampToValueAtTime(.001,next+sp*1.8);o2.connect(lp);lp.connect(g3);g3.connect(AU.mus);o2.start(next);o2.stop(next+sp*2);}
   if(s%2===0){var o3=x.createOscillator(),g4=x.createGain();o3.type="square";o3.frequency.value=root*4*Math.pow(2,(L[(s/2+bar*3)%8|0]+tr)/12);g4.gain.setValueAtTime(.08,next);g4.gain.exponentialRampToValueAtTime(.001,next+sp*1.6);o3.connect(g4);g4.connect(AU.mus);o3.start(next);o3.stop(next+sp*2);}
   next+=sp;step++;}
 },100);
};
AU.setVol=function(){if(!AU.ctx)return;AU.sfx.gain.value=AU.vol.s;AU.mus.gain.value=AU.vol.m*.35;};
