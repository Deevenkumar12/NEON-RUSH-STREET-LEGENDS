/* Neon Rush: Street Legends 2 - data. (c) 2026 Deeven Kumar, MIT License */
"use strict";
var VMAX=13500,KMH=380,SL=200,RW=2000;
// kmh=top speed, acc=accel (fraction of top / sec), hnd=steering, drf=drift power, off=off-road tolerance, nit=nitro power
var CARS=[
{n:"Suzuki Swift Sport",cat:"Hot hatch",kmh:215,acc:.26,hnd:1.05,drf:.8,off:1,nit:1,body:"hatch",snd:"i4",col:"#e83a3a"},
{n:"Mahindra Thar",cat:"Off-road SUV",kmh:170,acc:.21,hnd:.9,drf:.7,off:1.6,nit:.9,body:"suv",snd:"diesel",col:"#c9b27a"},
{n:"Royal Enfield Interceptor",cat:"Roadster bike",kmh:195,acc:.3,hnd:1.25,drf:.9,off:1.1,nit:1,body:"bike",snd:"thump",col:"#2e6bd1"},
{n:"Toyota Supra",cat:"Drift coupe",kmh:285,acc:.3,hnd:1.1,drf:1.4,off:.9,nit:1.1,body:"coupe",snd:"i6",col:"#ff7a1a"},
{n:"Ford Mustang GT",cat:"Muscle car",kmh:275,acc:.34,hnd:.9,drf:1.2,off:.9,nit:1,body:"muscle",snd:"v8",col:"#2b6cff"},
{n:"BMW M4 Competition",cat:"Sport sedan",kmh:292,acc:.34,hnd:1.1,drf:1.1,off:.9,nit:1.1,body:"sedan",snd:"i6",col:"#1fb0ff"},
{n:"Nissan GT-R",cat:"Supercar",kmh:315,acc:.37,hnd:1.05,drf:1,off:.9,nit:1.15,body:"gt",snd:"v6t",col:"#d9d9e3"},
{n:"Porsche 911 GT3",cat:"Track weapon",kmh:312,acc:.38,hnd:1.2,drf:1,off:.85,nit:1.1,body:"gt",snd:"flat6",col:"#ffd21a"},
{n:"Lamborghini Hurac\u00e1n",cat:"Hypercar",kmh:330,acc:.41,hnd:1.1,drf:1.1,off:.8,nit:1.25,body:"super",snd:"v10",col:"#7cff1a"},
{n:"Kawasaki Ninja H2",cat:"Superbike",kmh:355,acc:.46,hnd:1.3,drf:1,off:.8,nit:1.3,body:"bike",snd:"bike",col:"#38e07a"}
];
var COLORS=["#ff2d8a","#19e6ff","#e83a3a","#ff7a1a","#ffd21a","#7cff1a","#38e07a","#2b6cff","#8a5bff","#f2f0ff","#9aa3b2","#111118"];
// th: sky[2], sun, stars, bg layers, grass/road/rumble [a,b], lane, fog colour, fd=fog density, sp=scenery(weights), traffic types
var THEMES=[
{n:"Mumbai Marine Drive",tag:"Neon night",ic:"\ud83c\udf03",sky:["#05021a","#43125f"],sun:{c:"#e8e4ff",x:.78,y:.2,r:.05},stars:1,night:1,
 bg:[{k:"sky",c:"#1a0b3d",p:.25,h:.22,s:1},{k:"sky",c:"#0e0626",p:.5,h:.15,s:7}],grass:["#0f0f1c","#13132a"],road:["#2b2b3a","#303042"],rumble:["#ff2d8a","#19e6ff"],lane:"#f2f0ff",fog:"#1c0b38",fd:3.2,
 sp:[["bld",5],["lamp",3],["palm",2],["sign",1]],cows:1,traffic:["auto","bus","truck","hatch","suv"],bc:["#1b1440","#241a55","#2d1b66","#16113a"],win:"#ffd36b",leaf:"#1f6b4a"},
{n:"Rajasthan Desert",tag:"Golden dunes",ic:"\ud83c\udfdc\ufe0f",sky:["#2f86d8","#ffd9a0"],sun:{c:"#fff1c0",x:.3,y:.3,r:.07},
 bg:[{k:"dunes",c:"#e2b278",p:.2,h:.12,s:2},{k:"dunes",c:"#d29a5f",p:.5,h:.08,s:5}],grass:["#e3b373","#d9a766"],road:["#5a544e","#605a54"],rumble:["#c0392b","#f5e8d0"],lane:"#fff1c0",fog:"#f4d2a0",fd:2.2,
 sp:[["cactus",3],["rock",3],["bush",4],["sign",1]],traffic:["truck","suv","hatch","bus"],bc:["#d9a066"],win:"#caa",leaf:"#6f8f3a"},
{n:"Western Ghats Forest",tag:"Misty green",ic:"\ud83c\udf32",sky:["#9fd3c4","#f4f1c8"],sun:{c:"#fffbd0",x:.7,y:.38,r:.05},
 bg:[{k:"peaks",c:"#5d9a7c",p:.15,h:.2,s:3},{k:"hills",c:"#3e7d4f",p:.4,h:.12,s:4}],grass:["#2f7d3a","#297234"],road:["#4a4a4a","#515151"],rumble:["#e8e8e8","#c0392b"],lane:"#ffffff",fog:"#cfe6d4",fd:3.8,
 sp:[["tree",6],["bush",3],["rock",1],["sign",.5]],traffic:["truck","bus","hatch","auto"],bc:["#6b8e5a"],win:"#fff",leaf:"#2e8b3d"},
{n:"Kerala Monsoon",tag:"Heavy rain",ic:"\ud83c\udf27\ufe0f",sky:["#232b36","#6b7c8c"],sun:null,rain:1,
 bg:[{k:"hills",c:"#3c5a55",p:.2,h:.16,s:6},{k:"hills",c:"#264540",p:.5,h:.1,s:2}],grass:["#1f5a3a","#1b5035"],road:["#2a2e34","#30343a"],rumble:["#dddddd","#d33"],lane:"#cfd8e0",fog:"#55646f",fd:4,
 sp:[["palm",5],["tree",3],["bush",2],["lamp",2],["sign",1]],cows:1,traffic:["auto","bus","hatch","truck"],bc:["#4d6b66","#5a7a7a"],win:"#ffd36b",leaf:"#1f7a45"},
{n:"Delhi Summer Heat",tag:"Blazing noon",ic:"\u2600\ufe0f",sky:["#ffcf3f","#fff3c4"],sun:{c:"#ffffff",x:.5,y:.18,r:.08},
 bg:[{k:"sky",c:"#d8c9a0",p:.25,h:.2,s:8},{k:"sky",c:"#bfae82",p:.5,h:.12,s:3}],grass:["#b8a45a","#b09c52"],road:["#5b5b5b","#626262"],rumble:["#d33","#ffffff"],lane:"#ffffff",fog:"#fbe8a8",fd:2.6,
 sp:[["bld",4],["tree",3],["lamp",2],["sign",2],["bush",2]],cows:1,traffic:["auto","bus","truck","hatch","suv"],bc:["#e7c9a1","#d8b48a","#c9a27a","#f0dbb5"],win:"#6e8aa8",leaf:"#5b8a2e"},
{n:"Ladakh Snow Pass",tag:"Icy peaks",ic:"\ud83c\udfd4\ufe0f",sky:["#5aa8ee","#e8f4ff"],sun:{c:"#ffffff",x:.2,y:.25,r:.05},snow:1,
 bg:[{k:"peaks",c:"#9bb4cc",p:.12,h:.3,s:9,snowcap:1},{k:"peaks",c:"#6f8aa6",p:.3,h:.18,s:4,snowcap:1}],grass:["#f2f6fa","#e1ebf3"],road:["#4d5560","#555d68"],rumble:["#e44","#ffffff"],lane:"#ffffff",fog:"#dcebf7",fd:3,
 sp:[["pine",6],["rock",3],["sign",1]],traffic:["truck","suv","hatch","bus"],bc:["#9bb4cc"],win:"#fff",leaf:"#2d5a45"},
{n:"Goa Coastal Sunset",tag:"Beach cruise",ic:"\ud83c\udf34",sky:["#ff6f59","#ffd27a"],sun:{c:"#fff0b0",x:.62,y:.4,r:.09},
 bg:[{k:"hills",c:"#7a4a7a",p:.15,h:.1,s:5},{k:"dunes",c:"#2d3f66",p:.0,h:.035,s:1}],grass:["#e8d29a","#e0c88f"],road:["#3a3a44","#404049"],rumble:["#ffffff","#e63"],lane:"#fff6d0",fog:"#ffb98a",fd:2.4,
 sp:[["palm",6],["lamp",2],["bush",3],["sign",1],["bld",1]],traffic:["auto","hatch","suv","bus"],bc:["#f2b56b","#e56f5a","#f7d58a"],win:"#fff",leaf:"#2f9a4a"}
];
var LVN=[["Marine Drive Night Run","race",0],["Thar Desert Sprint","dash",1],["Ghat Drift Academy","drift",2],["Monsoon Street Race","race",3],["Delhi Heat Dash","dash",4],["Ladakh Ice Drift","drift",5],["Goa Sunset Grand Prix","race",6],["Dust Storm Dash","dash",1],["Forest Drift Battle","drift",2],["Midnight Showdown","race",0],["Kerala Storm Dash","dash",3],["Inferno Drift","drift",4],["Blizzard Race","race",5],["Coast Dash","dash",6],["LEGENDS FINAL","race",0]];
var BOTN=["Arjun","Rohan","Vikram","Karthik","Priya","Ananya","Rahul","Sneha","Aman","Dev","Ishaan","Meera","Zoya","Kabir","Nikhil","Tara"];
