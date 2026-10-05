import fs from 'fs';
const dir=new URL('../public/layers/',import.meta.url).pathname;
const W=600;
const wrap=(h,defs,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}">${defs}${body}</svg>`;
const lg=(id,stops,x2=0,y2=1)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
// deterministic rng
let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
const wave=(y,amp,n,x0=10,x1=590)=>{let p='';for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n;const yy=y+(r()-.5)*amp*2;p+=(i?'L':'M')+x.toFixed(1)+' '+yy.toFixed(1)+' ';}return p;};
const smooth=(pts)=>{let d=`M${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i];const mx=(x0+x1)/2;d+=` Q${x0} ${y0} ${mx} ${(y0+y1)/2}`;}const l=pts[pts.length-1];return d+` T${l[0]} ${l[1]}`;};
const ruffle=(y,amp,n,x0=8,x1=592)=>{const pts=[];for(let i=0;i<=n;i++){pts.push([x0+(x1-x0)*i/n,y+(i%2?amp:-amp)*(0.6+r()*.8)]);}return pts;};
const shadow=`<filter id="sh" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity=".35"/></filter>`;

// top bun
{let seeds='';for(let i=0;i<0;i++);
const defs=lg('b',[[0,'#f3b45c'],[.55,'#d98a35'],[1,'#a95a1b']])+`<radialGradient id="hi" cx=".38" cy=".25" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`+shadow;
fs.writeFileSync(dir+'1-top-bun.svg',wrap(200,defs,`<g filter="url(#sh)"><path d="M18 182C14 70 130 8 300 8s286 62 282 174c0 14-30 16-282 16S18 196 18 182Z" fill="url(#b)"/><path d="M18 182C14 70 130 8 300 8s286 62 282 174c0 14-30 16-282 16S18 196 18 182Z" fill="url(#hi)"/><path d="M40 176c120 14 400 14 520 0" stroke="#8c4511" stroke-opacity=".35" stroke-width="6" fill="none" stroke-linecap="round"/></g>`));}
// wham sauce
{const defs=lg('s',[[0,'#ffb27a'],[1,'#f0763f']])+shadow;
fs.writeFileSync(dir+'2-wham-sauce.svg',wrap(80,defs,`<g filter="url(#sh)"><path d="M14 22c40-14 90 6 150-4s110 10 170 0 120-14 170-2 62 4 82 8c8 12-6 20-20 22-26 2-30 24-50 24s-14-20-40-18-24 28-48 26-20-26-52-24-28 30-56 28-20-28-52-24-24 22-48 20-22-22-48-20-24 20-48 18-22-18-44-16S4 40 14 22Z" fill="url(#s)"/><path d="M60 24c80-8 160 6 240 0" stroke="#fff" stroke-opacity=".4" stroke-width="5" fill="none" stroke-linecap="round"/></g>`));}
// tomato
{const defs=lg('t',[[0,'#f0564a'],[1,'#c42a22']])+shadow;
let sl='';[[110,'#'],[300,'#'],[490,'#']].forEach(([cx],i)=>{sl+=`<g transform="translate(${cx} 36)"><ellipse rx="104" ry="26" fill="url(#t)"/><ellipse rx="92" ry="19" fill="#f77a6c" opacity=".55"/>${[-50,-18,18,50].map(x=>`<ellipse cx="${x}" cy="2" rx="9" ry="4" fill="#ffd9a0"/>`).join('')}<ellipse rx="104" ry="26" fill="none" stroke="#9c1f19" stroke-opacity=".5" stroke-width="3"/></g>`;});
fs.writeFileSync(dir+'3-tomato.svg',wrap(76,defs,`<g filter="url(#sh)">${sl}</g>`));}
// lettuce
{const defs=lg('l',[[0,'#9bd04a'],[1,'#4f9a25']])+shadow;
const pts=ruffle(40,16,30);const top=smooth(pts);
const bot=ruffle(62,10,30).reverse();
const path=top+' L'+bot[0][0]+' '+bot[0][1]+' '+smooth(bot).slice(1)+'Z';
fs.writeFileSync(dir+'4-lettuce.svg',wrap(100,defs,`<g filter="url(#sh)"><path d="${path}" fill="url(#l)" stroke="#3e7a1b" stroke-width="3" stroke-linejoin="round"/><path d="${smooth(ruffle(46,10,22,30,570))}" fill="none" stroke="#d6f08f" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/></g>`));}
// cheese
{const defs=lg('c',[[0,'#ffd23f'],[1,'#f2a516']])+shadow;
let drips='';[[70,30,26],[150,44,34],[240,26,30],[330,40,36],[420,22,28],[500,36,32],[556,24,28]].forEach(([x,len,w])=>{drips+=`<rect x="${x-w/2}" y="30" width="${w}" height="${len+14}" rx="${w/2}" fill="url(#c)"/>`;});
fs.writeFileSync(dir+'5-cheese.svg',wrap(96,defs,`<g filter="url(#sh)"><rect x="20" y="16" width="560" height="38" rx="9" fill="url(#c)"/>${drips}<rect x="38" y="24" width="500" height="5" rx="2.5" fill="#fff3b0" opacity=".7"/></g>`));}
// patty
{const defs=lg('p',[[0,'#6a3a24'],[.5,'#4a2514'],[1,'#2d150b']])+shadow;
const pts=[];for(let i=0;i<=24;i++)pts.push([14+572*i/24,26+(r()-.5)*14]);
const bpts=[];for(let i=24;i>=0;i--)bpts.push([14+572*i/24,100+(r()-.5)*12]);
const d=smooth(pts)+` L${bpts[0][0]} ${bpts[0][1]} `+smooth(bpts).slice(1)+'Z';
let sp='';for(let i=0;i<46;i++){sp+=`<ellipse cx="${30+r()*540}" cy="${40+r()*50}" rx="${3+r()*7}" ry="${1.5+r()*3}" fill="${r()>.5?'#8b5434':'#1c0c05'}" opacity=".6"/>`;}
fs.writeFileSync(dir+'6-patty.svg',wrap(120,defs,`<g filter="url(#sh)"><path d="${d}" fill="url(#p)" stroke="#1c0c05" stroke-width="3" stroke-linejoin="round"/>${sp}<path d="${smooth(pts.map(([x,y])=>[x,y+7]))}" fill="none" stroke="#b27a52" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"/></g>`));}
// pickles + onion
{const defs=lg('k',[[0,'#8fc24a'],[1,'#4f7f21']])+shadow;
let g='';[[70],[190],[320],[440],[540]].forEach(([cx],i)=>{g+=`<g transform="translate(${cx} ${30+(i%2)*4})"><ellipse rx="52" ry="15" fill="url(#k)" stroke="#3d6318" stroke-width="3"/><ellipse rx="40" ry="9" fill="#b6dc7a" opacity=".55"/></g>`;});
let o='';for(let i=0;i<26;i++){o+=`<rect x="${30+r()*530}" y="${38+r()*12}" width="${10+r()*14}" height="5" rx="2.5" fill="#f4eee0" stroke="#d5c9ad" stroke-width="1"/>`;}
fs.writeFileSync(dir+'7-pickles-onion.svg',wrap(70,defs,`<g filter="url(#sh)">${g}${o}</g>`));}
// bottom bun
{const defs=lg('bb',[[0,'#e9a24a'],[1,'#b0661f']])+shadow;
fs.writeFileSync(dir+'8-bottom-bun.svg',wrap(110,defs,`<g filter="url(#sh)"><path d="M16 14c0-6 120-8 284-8s284 2 284 8c0 60-26 94-80 96-70 4-136 4-204 4s-134 0-204-4c-54-2-80-36-80-96Z" fill="url(#bb)" stroke="#8c4511" stroke-opacity=".4" stroke-width="3"/><path d="M40 20c120 8 400 8 520 0" stroke="#f9d49a" stroke-opacity=".6" stroke-width="5" fill="none" stroke-linecap="round"/></g>`));}
// chicken
{const defs=lg('ch',[[0,'#f2b44a'],[1,'#c17a1c']])+shadow;
let bumps='';for(let i=0;i<60;i++){bumps+=`<circle cx="${30+r()*540}" cy="${25+r()*65}" r="${3+r()*5}" fill="${r()>.5?'#ffd98a':'#9a5a12'}" opacity=".55"/>`;}
const pts=[];for(let i=0;i<=16;i++)pts.push([14+572*i/16,24+(r()-.5)*22]);
const b=[];for(let i=16;i>=0;i--)b.push([14+572*i/16,98+(r()-.5)*16]);
const d=smooth(pts)+` L${b[0][0]} ${b[0][1]} `+smooth(b).slice(1)+'Z';
fs.writeFileSync(dir+'chicken.svg',wrap(120,defs,`<g filter="url(#sh)"><path d="${d}" fill="url(#ch)" stroke="#8a4f10" stroke-width="3" stroke-linejoin="round"/>${bumps}</g>`));}
// bean patty
{const defs=lg('bn',[[0,'#8a5a3a'],[1,'#4e2f1c']])+shadow;
let sp='';for(let i=0;i<50;i++){sp+=`<ellipse cx="${30+r()*540}" cy="${35+r()*55}" rx="${4+r()*6}" ry="${2+r()*3}" fill="${['#c9a074','#2b1a0f','#a0522d','#6b7f3a'][i%4]}" opacity=".7"/>`;}
const pts=[];for(let i=0;i<=20;i++)pts.push([14+572*i/20,26+(r()-.5)*12]);
const b=[];for(let i=20;i>=0;i--)b.push([14+572*i/20,100+(r()-.5)*10]);
const d=smooth(pts)+` L${b[0][0]} ${b[0][1]} `+smooth(b).slice(1)+'Z';
fs.writeFileSync(dir+'bean.svg',wrap(120,defs,`<g filter="url(#sh)"><path d="${d}" fill="url(#bn)" stroke="#2b1a0f" stroke-width="3" stroke-linejoin="round"/>${sp}</g>`));}
// fries icon
{let f='';for(let i=0;i<9;i++){const x=40+i*15,top=30+((i*37)%30);f+=`<rect x="${x}" y="${top}" width="12" height="${130-top}" rx="3" fill="${i%2?'#ffd54a':'#f7c534'}" stroke="#c99a12" stroke-width="1.5" transform="rotate(${(i-4)*4} ${x+6} 150)"/>`;}
fs.writeFileSync(dir+'fries.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${f}<path d="M30 110h140l-14 80H44Z" fill="#fe4646"/><path d="M30 110h140l-4 24H34Z" fill="#183d58"/><text x="100" y="168" font-family="sans-serif" font-weight="700" font-size="22" fill="#fff" text-anchor="middle">W</text></svg>`);}
// shake icon
fs.writeFileSync(dir+'shake.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M62 70h76l-10 120H72Z" fill="#fff4ec" stroke="#183d58" stroke-width="4" stroke-linejoin="round"/><path d="M66 100h68l-3 36H69Z" fill="#fe4646" opacity=".9"/><path d="M52 70c0-30 30-46 48-46s48 16 48 46Z" fill="#fff" stroke="#183d58" stroke-width="4" stroke-linejoin="round"/><circle cx="100" cy="20" r="9" fill="#fe4646" stroke="#183d58" stroke-width="3"/><path d="M104 20 118 -6" stroke="#183d58" stroke-width="7" stroke-linecap="round"/></svg>`);
