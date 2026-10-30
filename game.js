"use strict";
var $=function(i){return document.getElementById(i)},cv=$("c"),g=cv.getContext("2d"),W,H,DR=130;
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}addEventListener("resize",rs);rs();
var DB={},S=null,U=null,K={},T={},tilt=0,useTilt=false,segs=[],L=0,LS=0,stars=[];
try{DB=JSON.parse(localStorage.getItem("nrdb")||"{}")}catch(e){}
for(var si=0;si<90;si++)stars.push([Math.random(),Math.random()]);
function sv(){try{localStorage.setItem("nrdb",JSON.stringify(DB))}catch(e){}}
function cl(v,a,b){return Math.max(a,Math.min(b,v))}
function rnd(s){return function(){s=(s*16807)%2147483647;return(s-1)/2147483646}}
function scr(h){var u=$("ui");u.innerHTML=h;u.style.display=h?"flex":"none";$("tc").className=h?"":"on"}
function hs(s){var h=5381;for(var i=0;i<s.length;i++)h=(h*33^s.charCodeAt(i))>>>0;return h}
/* ---------- screens ---------- */
function login(){S=null;scr('<div class=p><h1>NEON RUSH</h1><h2>STREET LEGENDS</h2><input id=nm placeholder="Player name" maxlength=12><input id=pw type=password placeholder="Password"><button onclick=doLogin()>ENTER</button><p id=er></p></div>')}
function doLogin(){AU.init();var n=$("nm").value.trim(),pw=$("pw").value;if(!n||!pw){$("er").textContent="Enter name and password";return}
 var u=DB[n];if(u&&u.pw!==hs(pw)){$("er").textContent="Wrong password";return}
 if(!u)u=DB[n]={pw:hs(pw),car:0,col:COLORS[0],lv:0,best:{}};U=u;U.n=n;sv();menu()}
function menu(){S=null;var h='<div class=p><h2>'+U.n+' - LEVELS</h2><div class=gr>';
 LVN.forEach(function(l,i){var k=i>U.lv;h+='<button '+(k?'disabled':'')+' onclick=play('+i+')>'+(k?'\ud83d\udd12':THEMES[l[2]].ic)+' '+(i+1)+'. '+l[0]+'<small>'+l[1].toUpperCase()+' - '+THEMES[l[2]].n+'</small></button>'});
 scr(h+'</div><button onclick=garage()>GARAGE</button><button onclick=sett()>SETTINGS</button><button onclick=login()>LOGOUT</button></div>')}
function garage(){var h='<div class=p><h2>GARAGE</h2><div class=gr>';
 CARS.forEach(function(c,i){h+='<button class="'+(i==U.car?'on':'')+'" onclick="U.car='+i+';sv();garage()">'+c.n+'<small>'+c.cat+' - '+c.kmh+' km/h</small></button>'});
 h+='</div>';COLORS.forEach(function(c){h+='<i class=sw style="background:'+c+'" onclick="U.col=\''+c+'\';sv();garage()"></i>'});scr(h+'<br><button onclick=menu()>BACK</button></div>')}
function sett(){scr('<div class=p><h2>SETTINGS</h2><button onclick=tgTilt()>Gyro tilt: '+(useTilt?'ON':'OFF')+'</button><button onclick="AU.music=!AU.music">Music on/off</button><label>Music<input type=range min=0 max=100 value='+AU.vol.m*100+' oninput="AU.vol.m=this.value/100;AU.setVol()"></label><label>Effects<input type=range min=0 max=100 value='+AU.vol.s*100+' oninput="AU.vol.s=this.value/100;AU.setVol()"></label><p>W/Up gas, S/Down brake, A/D steer, Space drift, Shift nitro, Esc quit.<br>Tilt mode = auto gas + steer by tilting phone.</p><button onclick=menu()>BACK</button></div>')}
function tgTilt(){if(useTilt){useTilt=false;return sett()}var D=window.DeviceOrientationEvent;if(D&&D.requestPermission)D.requestPermission().then(function(r){useTilt=r=="granted";sett()});else{useTilt=true;sett()}}
addEventListener("deviceorientation",function(e){var o=(screen.orientation&&screen.orientation.angle)||0,v=o==90?e.beta:(o==270?-e.beta:e.gamma);tilt=cl((v||0)/25,-1,1)});
addEventListener("keydown",function(e){var k=e.key.length==1?e.key.toLowerCase():e.key;K[k]=1;if(k=="Escape"&&S){AU.silence();menu()}if(" ArrowUp ArrowDown".indexOf(e.key)>=0)e.preventDefault()});
addEventListener("keyup",function(e){K[e.key.length==1?e.key.toLowerCase():e.key]=0});
document.querySelectorAll("#tc b").forEach(function(b){var k=b.dataset.k;b.addEventListener("pointerdown",function(e){T[k]=1;e.preventDefault()});["pointerup","pointercancel","pointerleave"].forEach(function(v){b.addEventListener(v,function(){T[k]=0})})});
/* ---------- track ---------- */
function pick(w,r){var t=0,i;w.forEach(function(a){t+=a[1]});var q=r()*t;for(i=0;i<w.length;i++){q-=w[i][1];if(q<=0)return w[i][0]}return w[0][0]}
function build(li){var th=THEMES[LVN[li][2]],r=rnd(li*977+13),tot=LVN[li][1]=="dash"?5000:4000,y=0;segs=[];
 while(segs.length<tot){var n=60+r()*120|0,c=r()<.3?0:(r()-.5)*2*(3+li*.25),h=(r()-.5)*1800;if(y+h>5000||y+h<-3000)h=-h;
  for(var j=0;j<n;j++){var e=Math.min(1,j/12,(n-j)/12);segs.push({i:segs.length,y0:y+h*(1-Math.cos(Math.PI*j/n))/2,y1:y+h*(1-Math.cos(Math.PI*(j+1)/n))/2,c:c*e,sp:[]})}y+=h}
 L=segs.length;LS=L*SL;
 for(var i=0;i<L;i++)if(i%3==0&&r()<.8){var sd=r()<.5?-1:1;segs[i].sp.push({o:sd*(1.3+r()*1.8),t:pick(th.sp,r),k:r()*4|0})}
 return r}
function play(li){AU.init();var mode=LVN[li][1],th=THEMES[LVN[li][2]],r=build(li),c=CARS[U.car],vt=VMAX*c.kmh/KMH,cs=[],i,nt=mode=="dash"?L/22:L/45;
 for(i=0;i<nt;i++)cs.push({z:SL*20+r()*(LS-SL*20),x:[-.6,-.2,.2,.6][r()*4|0],v:(.14+r()*.18)*VMAX,t:pick((th.traffic||["hatch"]).map(function(a){return[a,1]}),r),col:COLORS[r()*9|0]});
 if(mode=="race")for(i=0;i<5;i++)cs.push({b:1,n:BOTN[r()*16|0],z:SL*(2+i*.6),x:[-.7,.7,-.35,.35,0][i],v:0,top:(.55+li*.025+r()*.07)*VMAX,t:["coupe","muscle","sedan","gt","super"][r()*5|0],col:COLORS[r()*9|0]});
 S={li:li,mode:mode,th:th,cars:cs,c:c,vt:vt,cd:3.5,t:0,bo:0,over:0,msg:"",note:"",nt:0,
  lim:mode=="dash"?LS/(vt*.8)*(1.2-li*.02):mode=="drift"?70:0,tgt:3000+li*600,p:{z:0,x:0,v:0,n:1,ds:0,hit:0,rank:1}};
 AU.setCar(c.snd);AU.vol.m=AU.vol.m;scr("")}
function fin(w,m){S.over=1;AU.silence();if(w){AU.fanfare();U.lv=Math.max(U.lv,Math.min(S.li+1,LVN.length-1))}sv();
 scr('<div class=p><h2>'+(w?'YOU WIN!':'TRY AGAIN')+'</h2><p>'+m+'</p><button onclick=play('+S.li+')>RETRY</button>'+(w&&S.li<LVN.length-1?'<button onclick=play('+(S.li+1)+')>NEXT LEVEL</button>':'')+'<button onclick=menu()>MENU</button></div>')}
/* ---------- update ---------- */
function upd(dt){var p=S.p,c=S.c,vt=S.vt;if(S.cd>0){S.cd-=dt;AU.upd(.2,0,0,0,0,0,true);return}
 S.t+=dt;S.nt-=dt;var br=K.s||K.ArrowDown||T.b,gas=K.w||K.ArrowUp||T.g||useTilt,nit=(K.Shift||T.n)&&p.n>.02&&p.v>0,
 st=cl((K.d||K.ArrowRight||T.r?1:0)-(K.a||K.ArrowLeft||T.l?1:0)+(useTilt?tilt:0),-1,1),dr=(K[" "]||T.d)&&Math.abs(st)>.2&&p.v>vt*.3,
 lim=vt*(nit?1+.25*c.nit:1),off=Math.abs(p.x)>1.05;if(off)lim=Math.min(lim,vt*.4*c.off);
 if(gas&&p.v<lim)p.v+=vt*c.acc*(nit?2.2:1)*dt;else if(p.v>lim)p.v-=VMAX*.4*dt;
 if(br)p.v-=VMAX*.8*dt;else if(!gas)p.v-=VMAX*.1*dt;p.v=Math.max(0,p.v);
 p.n=nit?Math.max(0,p.n-dt*.25):Math.min(1,p.n+dt*(dr?.1:.02));
 var sg=segs[(p.z/SL|0)%L],sp=p.v/VMAX;
 p.x+=dt*2*sp*st*c.hnd*(dr?1.6:1)-dt*2*sp*sp*sg.c*.3*(dr?.5:1);p.x=cl(p.x,-2.3,2.3);
 if(dr&&!off){p.ds+=dt*sp*160*c.drf;if(S.nt<=0){S.note="DRIFT "+(p.ds|0);S.nt=.5}}
 S.bo+=sg.c*sp*dt*.04;p.z+=p.v*dt;p.hit=Math.max(0,p.hit-dt);
 var rk=1;S.cars.forEach(function(o){
  if(o.b){o.v+=(o.top-o.v)*dt*.6;var tn=null;S.cars.forEach(function(q){if(!q.b){var d=q.z-o.z;if(d>0&&d<2200&&Math.abs(q.x-o.x)<.35)tn=q}});if(tn)o.x+=(o.x>tn.x?1:-1)*dt*.9;o.x=cl(o.x,-.9,.9);if(o.z>p.z)rk++}
  o.z+=o.v*dt;if(!o.b&&o.z>LS)o.z-=LS;
  var dz=((o.z-p.z)%LS+LS)%LS;if(dz<SL*1.1&&Math.abs(o.x-p.x)<.3){p.v=Math.min(p.v,o.v*.6);p.x+=(p.x<o.x?-.08:.08);if(!p.hit){p.hit=.5;AU.thud()}}});
 p.rank=rk;AU.upd(cl(p.v/vt,0,1.2),gas?1:0,sp,dr?1:0,nit,S.th.rain,true);
 if(S.mode=="drift"&&p.ds>=S.tgt)return fin(1,"Drift score "+(p.ds|0)+" in "+S.t.toFixed(1)+"s");
 if(S.lim&&S.t>S.lim)return fin(0,S.mode=="drift"?"Drift score "+(p.ds|0)+" / "+S.tgt:"Time up!");
 if(p.z>=LS){if(S.mode=="race")fin(p.rank<=3,"Position "+p.rank+" / 6 - "+S.t.toFixed(1)+"s");else if(S.mode=="dash")fin(1,"Finished in "+S.t.toFixed(1)+"s");else fin(0,"Track ended. Score "+(p.ds|0)+" / "+S.tgt)}}
/* ---------- drawing ---------- */
var BT={hatch:[1,.55],suv:[1.1,.72],bus:[1.3,1.3],truck:[1.3,1.1],auto:[.8,.85],bike:[.35,.7],coupe:[1,.42],muscle:[1.05,.45],sedan:[1,.5],gt:[1,.42],super:[1.05,.36]};
function car(x,y,w,col,t,nos){var b=BT[t]||BT.hatch,bw=w*b[0],bh=w*b[1];g.fillStyle="rgba(0,0,0,.35)";g.fillRect(x-bw/2,y-bh*.06,bw,bh*.1);
 g.fillStyle="#111";g.fillRect(x-bw/2,y-bh*.22,bw*.16,bh*.22);g.fillRect(x+bw*.34,y-bh*.22,bw*.16,bh*.22);g.fillStyle=col;
 if(b[1]>1){g.fillRect(x-bw/2,y-bh,bw,bh*.8);g.fillStyle="#9fd8ff";g.fillRect(x-bw*.4,y-bh*.92,bw*.8,bh*.25)}
 else{g.fillRect(x-bw/2,y-bh*.6,bw,bh*.4);g.fillRect(x-bw*.38,y-bh,bw*.76,bh*.4);g.fillStyle="#9fd8ff";g.fillRect(x-bw*.3,y-bh*.95,bw*.6,bh*.3)}
 g.fillStyle="#ff2020";g.fillRect(x-bw*.46,y-bh*.5,bw*.16,bh*.1);g.fillRect(x+bw*.3,y-bh*.5,bw*.16,bh*.1);
 if(nos){g.fillStyle="#19e6ff";g.beginPath();g.ellipse(x-bw*.3,y-bh*.15,bw*.06,bh*.3*Math.random(),0,0,7);g.ellipse(x+bw*.3,y-bh*.15,bw*.06,bh*.3*Math.random(),0,0,7);g.fill()}}
function scn(t,x,y,u,th,k){var w,h;switch(t){
 case"bld":w=u*1.2;h=u*(1.8+k*.5);g.fillStyle=th.bc[k%th.bc.length];g.fillRect(x-w/2,y-h,w,h);g.fillStyle=th.win;for(var a=0;a<5;a++)for(var b=0;b<7;b++)if((a*7+b+k)%3)g.fillRect(x-w/2+w*(.1+a*.17),y-h+h*(.06+b*.13),w*.1,h*.06);break;
 case"palm":case"tree":g.fillStyle="#5a3b1e";g.fillRect(x-u*.03,y-u*.8,u*.06,u*.8);g.fillStyle=th.leaf;g.beginPath();g.arc(x,y-u*.9,u*(t=="palm"?.25:.35),0,7);g.fill();break;
 case"pine":g.fillStyle=th.leaf;g.beginPath();g.moveTo(x-u*.25,y-u*.2);g.lineTo(x,y-u*1.3);g.lineTo(x+u*.25,y-u*.2);g.fill();g.fillStyle="#4a3520";g.fillRect(x-u*.03,y-u*.2,u*.06,u*.2);break;
 case"cactus":g.fillStyle=th.leaf;g.fillRect(x-u*.04,y-u*.7,u*.08,u*.7);g.fillRect(x-u*.16,y-u*.5,u*.12,u*.05);g.fillRect(x-u*.16,y-u*.62,u*.05,u*.17);break;
 case"rock":g.fillStyle="#888";g.beginPath();g.ellipse(x,y-u*.1,u*.2,u*.12,0,0,7);g.fill();break;
 case"bush":g.fillStyle=th.leaf;g.beginPath();g.ellipse(x,y-u*.08,u*.18,u*.1,0,0,7);g.fill();break;
 case"lamp":g.fillStyle="#555";g.fillRect(x-u*.015,y-u*.8,u*.03,u*.8);g.fillStyle="#fff3b0";g.beginPath();g.arc(x,y-u*.82,u*.05,0,7);g.fill();break;
 default:g.fillStyle="#555";g.fillRect(x-u*.02,y-u*.5,u*.04,u*.5);g.fillStyle=k%2?"#2a8f4a":"#1d5fbf";g.fillRect(x-u*.2,y-u*.7,u*.4,u*.22)}}
function pj(ccx,wy,cz){var s=.84/cz;return{x:W/2-s*ccx*W/2,y:H/2-s*wy*H/2,w:s*RW*W/2,z:cz}}
function poly(a,b,c,d,e,f,col){g.fillStyle=col;g.beginPath();g.moveTo(a-b,c);g.lineTo(a+b,c);g.lineTo(d+e,f);g.lineTo(d-e,f);g.fill()}
function sky(th,bo,rain){var hy=H/2,gr=g.createLinearGradient(0,0,0,hy);gr.addColorStop(0,th.sky[0]);gr.addColorStop(1,th.sky[1]);g.fillStyle=gr;g.fillRect(0,0,W,hy);g.fillStyle=th.grass[0];g.fillRect(0,hy,W,hy);
 if(th.stars){g.fillStyle="#fff";stars.forEach(function(s){g.fillRect(s[0]*W,s[1]*hy*.8,2,2)})}
 if(th.sun){g.fillStyle=th.sun.c;g.beginPath();g.arc(th.sun.x*W,th.sun.y*hy*1.6,th.sun.r*W,0,7);g.fill()}
 th.bg.forEach(function(b){g.fillStyle=b.c;g.beginPath();g.moveTo(0,hy);for(var x=0;x<=W;x+=14){var q=(x/W+bo*b.p*20)*b.s*9,m=b.k=="sky"?.4+.6*Math.abs(Math.sin(Math.floor(q*3)*1.7)):b.k=="peaks"?Math.abs(Math.sin(q)):.5+.5*Math.sin(q);g.lineTo(x,hy-b.h*H*m)}g.lineTo(W,hy);g.fill()});
 var f=g.createLinearGradient(0,hy-H*.12,0,hy+H*.02);f.addColorStop(0,"rgba(0,0,0,0)");f.addColorStop(1,th.fog);g.fillStyle=f;g.fillRect(0,hy-H*.12,W,H*.14)}
function render(){var p=S.p,th=S.th,ci=p.z/SL|0,bs=segs[ci%L],bp=(p.z%SL)/SL,camY=1000+bs.y0+(bs.y1-bs.y0)*bp,camX=p.x*RW,camZ=p.z-.84*1000,x=0,dx=-bs.c*bp,maxy=H,pr=[],n,cb=[];
 var sh=p.hit>0?(Math.random()-.5)*8:0;g.save();g.translate(sh,sh);sky(th,S.bo);
 for(n=0;n<DR;n++){var s=segs[(ci+n)%L],a=pj(camX-x,s.y0-camY,(ci+n)*SL-camZ),b=pj(camX-x-dx,s.y1-camY,(ci+n+1)*SL-camZ);x+=dx;dx+=s.c;var alt=((ci+n)/3|0)%2;pr[n]={a:a,b:b,clip:maxy};
  if(b.y>=a.y||b.y>=maxy)continue;g.fillStyle=th.grass[alt];g.fillRect(0,b.y,W,a.y-b.y+1);
  poly(a.x,a.w*1.15,a.y,b.x,b.w*1.15,b.y,th.rumble[alt]);var fl=(ci+n)>=L-4,rc=th.road[alt];
  poly(a.x,a.w,a.y,b.x,b.w,b.y,fl?(alt?"#fff":"#111"):rc);if(!alt){poly(a.x-a.w/3,a.w/40,a.y,b.x-b.w/3,b.w/40,b.y,th.lane);poly(a.x+a.w/3,a.w/40,a.y,b.x+b.w/3,b.w/40,b.y,th.lane)}
  g.globalAlpha=Math.min(.92,Math.pow(n/DR,2.2)*(th.fd/3));g.fillStyle=th.fog;g.fillRect(0,b.y,W,a.y-b.y+1);g.globalAlpha=1;maxy=b.y}
 S.cars.forEach(function(o){var dz=((o.z-p.z)%LS+LS)%LS,q=(p.z%SL)+dz;n=q/SL|0;if(n>0&&n<DR-1)(cb[n]=cb[n]||[]).push([o,(q%SL)/SL])});
 for(n=DR-2;n>=0;n--){var r=pr[n];if(!r)continue;g.globalAlpha=Math.min(1,(DR-n)/30);var hid=r.a.y>r.clip+2;
  if(!hid)segs[(ci+n)%L].sp.forEach(function(q){scn(q.t,r.a.x+q.o*r.a.w,r.a.y,r.a.w,th,q.k)});
  (cb[n]||[]).forEach(function(z){var o=z[0],t=z[1],u=r.a.w+(r.b.w-r.a.w)*t,cx=r.a.x+(r.b.x-r.a.x)*t+o.x*u,cy=r.a.y+(r.b.y-r.a.y)*t;if(cy<r.clip+2)car(cx,cy,u*.4,o.col,o.t)});g.globalAlpha=1}
 var wv=Math.min(W,H*1.6)*.22,bt=S.c.body;g.save();g.translate(W/2,H*.93+Math.sin(S.t*30)*p.v/VMAX*2);var stn=(K.d||K.ArrowRight||T.r?1:0)-(K.a||K.ArrowLeft||T.l?1:0)+(useTilt?tilt:0);g.rotate(cl(stn,-1,1)*.05*(K[" "]||T.d?4:1));
 car(0,0,wv,U.col,bt,(K.Shift||T.n)&&p.n>.02);g.restore();g.restore();
 if(th.rain){g.strokeStyle="#cfe3ffaa";g.beginPath();for(var i=0;i<90;i++){var rx=Math.random()*W,ry=Math.random()*H;g.moveTo(rx,ry);g.lineTo(rx-4,ry+18)}g.stroke()}
 if(th.snow){g.fillStyle="#fff";for(i=0;i<70;i++)g.fillRect(Math.random()*W,Math.random()*H,3,3)}hud()}
function tx(s,x,y,sz,al,col){g.font="700 "+sz+"px Trebuchet MS,Arial,sans-serif";g.textAlign=al||"left";g.fillStyle=col||"#fff";g.fillText(s,x,y)}
function hud(){var p=S.p,k=Math.min(W,H*1.6)/700;tx((p.v/VMAX*KMH|0)+"",W/2,H-8,Math.max(30,50*k),"center");tx("km/h",W/2+70*k,H-10,16,"left","#19e6ff");
 g.fillStyle="#fff3";g.fillRect(W/2-120,H-100*k-30,240,10);g.fillStyle="#19e6ff";g.fillRect(W/2-120,H-100*k-30,240*p.n,10);
 if(S.mode=="race")tx("P"+p.rank+"/6",16,50*k+16,50*k,"left","#ff2d8a");
 tx(S.t.toFixed(1)+"s"+(S.lim?" / "+S.lim.toFixed(0)+"s":""),W-16,34,24,"right");
 if(S.mode=="drift")tx("DRIFT "+(p.ds|0)+" / "+S.tgt,W-16,64,22,"right","#ffd21a");
 g.fillStyle="#fff3";g.fillRect(16,H-14,W-32,6);g.fillStyle="#ff2d8a";g.fillRect(16,H-14,(W-32)*Math.min(1,p.z/LS),6);
 if(S.nt>0)tx(S.note,W/2,H*.3,34,"center","#ff2d8a");if(S.cd>0)tx(S.cd>.5?Math.ceil(S.cd-.5)+"":"GO!",W/2,H*.4,120,"center","#19e6ff")}
var lt=0;function loop(t){var dt=Math.min(.05,(t-lt)/1e3||0);lt=t;
 if(S&&!S.over){upd(dt);render()}else if(S)render();else{var gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,"#05021a");gr.addColorStop(1,"#43125f");g.fillStyle=gr;g.fillRect(0,0,W,H);if(U)car(W*.7,H*.8,Math.min(W,H)*.5,U.col,CARS[U.car].body)}
 requestAnimationFrame(loop)}
login();requestAnimationFrame(loop);
