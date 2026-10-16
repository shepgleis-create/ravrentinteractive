"use strict";
document.documentElement.classList.add("has-js");

const projects = {
  mechanic: {
    number:"01",name:"Ravrent Mechanic",kind:"Automotive assistant",phase:"Private beta",
    description:"An automotive assistant built around real vehicle context: symptoms, diagnostic conversations, media uploads, garage records and saved reports.",
    points:["Vehicle profiles and repair history","Photo and video input","Assisted troubleshooting and reference research","Saved diagnostic reports"],
    link:null,
    note:"Ravrent Mechanic is in private beta. Public chat access is not promoted until account security, centralized limits and abuse safeguards are ready. AI responses depend on third-party model availability and are not a substitute for a physical inspection."
  },
  outmile:{
    number:"02",name:"Outmile",kind:"Mapping and exploration",phase:"Prototype",
    description:"An evolving navigation product exploring trail discovery, road trips, scenic drives and day-to-day GPS.",
    points:["Road and off-road exploration","Scenic route discovery and trip planning","Guidance and mapping features in development","Offline and reliability improvements"],
    link:"https://ravrent-explore.vercel.app/",
    note:"This is a developing prototype. The map on this portfolio site is fictional concept artwork, not real mapping data or navigational directions."
  },
  motor:{
    number:"03",name:"Motor Dynasty",kind:"Automotive simulation",phase:"Playable prototype",
    description:"A deep automotive corporation simulation spanning vehicle engineering, factories, contracts, economic systems and long-term strategy.",
    points:["Vehicles, engines and transmissions","Manufacturing and supplier operations","Model years and generations","Company finances and competitive strategy"],
    link:"https://motor-eta-six.vercel.app/",
    note:"The engineering diagram on this page is original illustrative artwork, not an in-game capture."
  },
  block:{
    number:"05",name:"Block Frontier",kind:"Sandbox game",phase:"Early prototype",
    description:"A block-based sandbox game in development, with terrain, building, mining and creative exploration.",
    points:["Voxel world and terrain systems","Block mining and construction","Exploration and survival experiments","Continued mechanics and visual refinement"],
    link:"https://block-frontier.hatchable.site",
    note:"The geometric animation is an original concept visualization, not actual gameplay footage."
  },
  empire:{
    number:"04",name:"Studio Empire",kind:"Game development simulation",phase:"Playable development build",
    description:"Start as a solo game creator in a garage and grow into a staffed studio. Create and release games, hire developers, research technology, make publisher deals, and purchase real in-game office upgrades as the company grows.",
    points:["Four purchasable office locations with different capacities","Playable game creation, releases and reviews","Hiring, finances, publishers, rivals and research","Animated staff and 3D-inspired office environments"],
    link:"https://studio-empire-omega.vercel.app/",
    note:"Verified development build from the Studio-Empire repository, version v0.8. Office upgrades are purchased using in-game funds; this website's office exhibit is illustrative and does not edit your actual game save."
  },
  life:{
    number:"06",name:"Life OS",kind:"Life and business simulation",phase:"In development",
    description:"An evolving simulation of companies, decisions, economics and player progression.",
    points:["Running companies and creating businesses","Economic and financial decisions","Connected systems and player choice","Interface and gameplay rework"],
    link:null,
    note:"No verified public release link is available at this time."
  }
};
window.RavrentProjects=Object.freeze(projects);
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const symbol = name=>'<svg aria-hidden="true"><use href="#icon-'+name+'"></use></svg>';
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const dialog = $("#projectDialog");

function showProject(id){
  const p=projects[id];if(!p)return;
  $("#dialogContent").innerHTML =
    '<div class="modal-header"><span class="modal-index">RAVRENT INTERACTIVE / '+p.number+'</span>'+
    '<button type="button" class="modal-dismiss" data-close-modal aria-label="Close project details">'+symbol("close")+'</button>'+
    '<span class="modal-category">'+p.kind+'</span><h2 id="modalTitle">'+p.name+'</h2><span class="status-pill">'+p.phase+'</span></div>'+
    '<div class="modal-main"><div><h3>About this project</h3><p>'+p.description+'</p><h3>Areas of development</h3>'+
    '<ul class="feature-bullets">'+p.points.map(x=>'<li>'+x+'</li>').join("")+'</ul></div>'+
    '<aside class="modal-aside"><span class="overline">Project status</span><strong>'+p.phase+'</strong>'+
    (p.link?'<a class="button button-dark" href="'+p.link+'" target="_blank" rel="noopener noreferrer">Open the prototype '+symbol("external")+'</a>':'<span class="no-public-link">Not publicly available</span>')+
    '<p>'+p.note+'</p><button type="button" class="modal-copy" id="copyProjectLink">Copy project link '+symbol("external")+'</button></aside></div>';
  if(!dialog.open)dialog.showModal();
  document.body.classList.add("modal-open");
  document.title=p.name+" — Ravrent Interactive";
}
function closeProject(){
  if(dialog.open)dialog.close();
  document.body.classList.remove("modal-open");
  document.title="Ravrent Interactive — Games and Software";
  if(location.hash.startsWith("#project/"))history.replaceState(null,"","#projects");
}
function processHash(){
  const found=location.hash.match(/^#project\/(mechanic|outmile|motor|empire|block|life)$/);
  if(found)showProject(found[1]);else if(dialog.open)closeProject();
}
window.addEventListener("hashchange",processHash);
dialog.addEventListener("close",closeProject);
document.addEventListener("click",e=>{
  if(e.target.closest("#copyProjectLink")){
    const id=location.hash.match(/^#project\/(mechanic|outmile|motor|empire|block|life)$/)?.[1];
    if(id&&typeof window.copyProjectUrl==="function")window.copyProjectUrl(id);
    return;
  }
  if(e.target.closest("[data-close-modal]"))closeProject();
  const el=e.target.closest("[data-project]");if(el){location.hash="project/"+el.dataset.project}
});
processHash();

const mobile=$("#mobileNav"),toggle=$("#menuToggle");
function setMenu(open){
  mobile.hidden=!open;toggle.setAttribute("aria-expanded",String(open));
  toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
  toggle.innerHTML=symbol(open?"close":"menu");
}
toggle.addEventListener("click",()=>setMenu(mobile.hidden));
$$(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
addEventListener("hashchange",()=>setMenu(false));
addEventListener("resize",()=>{if(innerWidth>780)setMenu(false)});
$("#year").textContent=String(new Date().getFullYear());

if("IntersectionObserver" in window){
  const reveal=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add("is-shown");reveal.unobserve(entry.target)}
  },{threshold:0.08,rootMargin:"0px 0px -24px 0px"});
  $$(".reveal").forEach(n=>reveal.observe(n));
  const navigation=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      const id=entry.target.id;
      $$(".nav-links a").forEach(a=>a.setAttribute("aria-current",a.getAttribute("href")==="#"+id?"location":"false"))
    }
  },{rootMargin:"-25% 0px -65% 0px"});
  ["projects","mechanic","outmile","empire","games","studio"].forEach(id=>{const el=document.getElementById(id);if(el)navigation.observe(el)})
}else $$(".reveal").forEach(n=>n.classList.add("is-shown"));

const mechanicViews={
  diagnosis:{
    eyebrow:"Vehicle assistance",title:"Start with what you know.",body:"Describe a symptom, attach supporting media and keep the conversation connected to your vehicle.",
    lines:[["Engine hesitation","Review symptoms"],["Unusual noise","Add audio or video"],["Warning light","Check trouble codes"]]
  },
  garage:{
    eyebrow:"Your garage",title:"Keep vehicle details together.",body:"Profiles and repair history help keep context in one place as you troubleshoot.",
    lines:[["Vehicle profiles","Save the details"],["Maintenance records","Track past work"],["Reports","Return to earlier findings"]]
  },
  research:{
    eyebrow:"Research and reports",title:"A clearer repair workflow.",body:"Explore possible causes, document your findings and follow up with physical testing.",
    lines:[["Reference information","When available"],["Report history","Revisit notes"],["Next checks","Plan an inspection"]]
  }
};
function setMechanicView(mode){
  const d=mechanicViews[mode];if(!d)return;
  $$(".mechanic-switch button").forEach(b=>{
    const on=b.dataset.mechanic===mode;b.classList.toggle("selected",on);b.setAttribute("aria-pressed",String(on))
  });
  $("#mechanicPreviewContent").innerHTML='<div class="device-eyebrow">'+d.eyebrow+'</div><h3>'+d.title+'</h3><p>'+d.body+'</p><div class="device-rows">'+d.lines.map(([title,desc],i)=>'<div class="device-row"><span class="device-row-icon">'+String(i+1).padStart(2,"0")+'</span><span><strong>'+title+'</strong><small>'+desc+'</small></span><span class="row-chevron">↗</span></div>').join("")+'</div>';
}
$$("[data-mechanic]").forEach(b=>b.addEventListener("click",()=>setMechanicView(b.dataset.mechanic)));setMechanicView("diagnosis");

const labViews={
  engineering:{title:"Engineering",headline:"Build the vehicle.",detail:"Plan vehicle lines, choose mechanical systems and develop models over time.",labels:["Platform development","Powertrain strategy","Model generations"]},
  factory:{title:"Operations",headline:"Manage production.",detail:"Scale factories, balance suppliers and bring planned products into manufacturing.",labels:["Factory utilization","Component sourcing","Production scheduling"]},
  strategy:{title:"Strategy",headline:"Run the company.",detail:"Balance investment and business decisions against competition and changing demand.",labels:["Corporate decisions","Market competition","Long-term planning"]}
};
function setLab(mode){
  const p=labViews[mode];if(!p)return;
  $$(".lab-tabs button").forEach(b=>{const selected=b.dataset.lab===mode;b.classList.toggle("active",selected);b.setAttribute("aria-selected",String(selected));b.tabIndex=selected?0:-1});
  $("#labTitle").textContent=p.headline;$("#labDetail").textContent=p.detail;
  $("#labLabels").innerHTML=p.labels.map((x,i)=>'<div class="lab-row"><span>0'+(i+1)+'</span>'+x+symbol("arrow")+'</div>').join("");
}
$$("[data-lab]").forEach(b=>b.addEventListener("click",()=>setLab(b.dataset.lab)));
$(".lab-tabs").addEventListener("keydown",e=>{
  if(!["ArrowLeft","ArrowRight"].includes(e.key))return;
  e.preventDefault();const names=Object.keys(labViews),current=names.indexOf($(".lab-tabs button.active").dataset.lab);
  const next=names[(current+(e.key==="ArrowRight"?1:-1)+names.length)%names.length];setLab(next);$('[data-lab="'+next+'"]').focus();
});setLab("engineering");

// All map and animated diagram data is synthetic studio art, never actual GPS information.
const terrain=$("#terrainCanvas"),mapctx=terrain.getContext("2d",{alpha:false});
const mapRoutes={
  scenic:[[.09,.83],[.18,.71],[.29,.76],[.38,.49],[.52,.52],[.64,.35],[.75,.37],[.88,.19]],
  trail:[[.13,.86],[.2,.63],[.18,.44],[.37,.43],[.42,.64],[.61,.48],[.7,.27],[.86,.19]]
};
let mapW=1,mapH=1,routeMode="scenic",playMap=!reduce.matches,mapElapsed=0,mapPrevious=0,mapFrame=0,mapVisible=true;
function resizeMap(){
  const r=terrain.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
  if(!r.width||!r.height)return;
  mapW=r.width;mapH=r.height;terrain.width=Math.floor(r.width*d);terrain.height=Math.floor(r.height*d);
  mapctx.setTransform(d,0,0,d,0,0);
}
function mapPaint(time){
  if(playMap)mapElapsed+=Math.min(65,Math.max(0,time-(mapPrevious||time)));
  mapPrevious=time;
  const w=mapW,h=mapH,c=mapctx;
  c.fillStyle="#d3dfd2";c.fillRect(0,0,w,h);
  for(let j=0;j<29;j++){
    c.beginPath();
    for(let i=0;i<=112;i++){
      const x=i/112*w;
      const y=j/28*h+Math.sin(i*.14+j*.61)*19+Math.sin(i*.068-j*.45)*11+Math.cos(i*.035+j*.81)*6;
      if(i===0)c.moveTo(x,y);else c.lineTo(x,y)
    }
    c.strokeStyle=j%5===0?"rgba(99,135,103,.42)":"rgba(99,135,103,.21)";
    c.lineWidth=j%5===0?1.3:.8;c.stroke()
  }
  for(let i=0;i<8;i++){
    c.beginPath();const x=(i+.3)/8*w;
    c.moveTo(x,-20);
    for(let y=0;y<=h+20;y+=7)c.lineTo(x+Math.sin(y*.028+i*.8)*21,y);
    c.strokeStyle="rgba(135,161,135,.16)";c.lineWidth=1;c.stroke()
  }
  const points=mapRoutes[routeMode];
  function path(){
    c.beginPath();points.forEach(([x,y],i)=>{if(i===0)c.moveTo(x*w,y*h);else c.lineTo(x*w,y*h)})
  }
  c.lineCap="round";c.lineJoin="round";path();c.strokeStyle="#fffef2";c.lineWidth=10;c.stroke();
  path();c.strokeStyle=routeMode==="scenic"?"#cf8157":"#346b58";c.lineWidth=5;c.stroke();
  const p=mapElapsed/16000%(points.length-1),at=Math.floor(p),t=p-at;
  const x=(points[at][0]*(1-t)+points[at+1][0]*t)*w,y=(points[at][1]*(1-t)+points[at+1][1]*t)*h;
  c.beginPath();c.arc(x,y,13,0,Math.PI*2);c.fillStyle="#ffffffad";c.fill();
  c.beginPath();c.arc(x,y,6,0,Math.PI*2);c.fillStyle="#245e4f";c.fill();
  c.fillStyle="#617a66";c.font="600 10px system-ui";
  c.fillText("RIDGE LOOP",w*.44,h*.21);c.fillText("VALLEY PASS",w*.12,h*.42);
  if(playMap&&!document.hidden&&mapVisible)mapFrame=requestAnimationFrame(mapPaint);
}
function switchRoute(mode){
  if(!mapRoutes[mode])return;routeMode=mode;mapElapsed=0;mapPrevious=performance.now();
  $$("[data-map-route]").forEach(b=>{const on=b.dataset.mapRoute===mode;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on))});
  cancelAnimationFrame(mapFrame);mapPaint(mapPrevious)
}
$$("[data-map-route]").forEach(b=>b.addEventListener("click",()=>switchRoute(b.dataset.mapRoute)));
$("#mapPause").addEventListener("click",()=>{
  playMap=!playMap;const btn=$("#mapPause");
  btn.setAttribute("aria-label",playMap?"Pause map animation":"Play map animation");btn.innerHTML=symbol(playMap?"pause":"play");
  mapPrevious=performance.now();cancelAnimationFrame(mapFrame);mapPaint(mapPrevious)
});
if(reduce.matches){$("#mapPause").innerHTML=symbol("play");$("#mapPause").setAttribute("aria-label","Play map animation")}
new ResizeObserver(()=>{resizeMap();cancelAnimationFrame(mapFrame);mapPaint(performance.now())}).observe(terrain);
resizeMap();mapPaint(performance.now());

const heroCanvas=$("#heroCanvas"),hc=heroCanvas.getContext("2d",{alpha:true});
let hW=1,hH=1,heroFrame=0,heroVisible=true,mouse={x:.5,y:.5};
function resizeHero(){
  const rect=heroCanvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
  if(!rect.width||!rect.height)return;
  hW=rect.width;hH=rect.height;heroCanvas.width=Math.floor(hW*d);heroCanvas.height=Math.floor(hH*d);
  hc.setTransform(d,0,0,d,0,0)
}
function paintHero(t){
  const c=hc,w=hW,h=hH;
  c.clearRect(0,0,w,h);
  const cx=w*.56+(mouse.x-.5)*20,cy=h*.47+(mouse.y-.5)*15,r=Math.min(w*.47,h*.57);
  for(let i=0;i<23;i++){
    const ring=r*(.18+i*.039);
    c.beginPath();c.ellipse(cx,cy,ring,ring*.68,-.37,0,Math.PI*2);
    c.strokeStyle=i%5===0?"rgba(142,178,218,.21)":"rgba(136,174,207,.075)";
    c.lineWidth=i%5===0?1.1:.65;c.stroke();
  }
  for(let i=0;i<50;i++){
    const angle=i*2.399963+(reduce.matches?0:t*.000018*(1+i%4)),rr=r*(.15+(i%16)/17);
    c.beginPath();c.arc(cx+Math.cos(angle)*rr,cy+Math.sin(angle)*rr*.7,i%9===0?1.8:.8,0,Math.PI*2);
    c.fillStyle=i%9===0?"rgba(204,224,244,.65)":"rgba(163,192,223,.22)";c.fill()
  }
  if(!reduce.matches&&!document.hidden&&heroVisible)heroFrame=requestAnimationFrame(paintHero)
}
heroCanvas.addEventListener("pointermove",e=>{
  if(reduce.matches)return;const b=heroCanvas.getBoundingClientRect();
  mouse.x=(e.clientX-b.left)/b.width;mouse.y=(e.clientY-b.top)/b.height
},{passive:true});
new ResizeObserver(()=>{resizeHero();cancelAnimationFrame(heroFrame);paintHero(0)}).observe(heroCanvas);
resizeHero();paintHero(0);
if("IntersectionObserver" in window){
  const visibility=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.target===terrain){
        mapVisible=entry.isIntersecting;cancelAnimationFrame(mapFrame);
        mapPrevious=performance.now();if(mapVisible&&!document.hidden)mapPaint(mapPrevious);
      }
      if(entry.target===heroCanvas){
        heroVisible=entry.isIntersecting;cancelAnimationFrame(heroFrame);
        if(heroVisible&&!document.hidden)paintHero(performance.now());
      }
    }
  },{rootMargin:"65px"});
  visibility.observe(terrain);visibility.observe(heroCanvas);
}

document.addEventListener("visibilitychange",()=>{
  cancelAnimationFrame(mapFrame);cancelAnimationFrame(heroFrame);
  mapPrevious=performance.now();
  if(!document.hidden){mapPaint(mapPrevious);paintHero(mapPrevious)}
});

if("serviceWorker" in navigator && location.protocol==="https:"){
  window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}
