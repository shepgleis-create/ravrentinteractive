// Ravrent Interactive project catalog and comparison utilities.
// Pure exported helpers are exercised by Node tests; browser UI is progressive enhancement.
const IDS=["mechanic","outmile","motor","empire","server","block","life"];
const GROUP={mechanic:"app",outmile:"app",motor:"game",empire:"game",server:"game",block:"game",life:"game"};
const STORE="ravrent-studio-saved-v1";
export function normalizeSaved(values){
  return Array.isArray(values)?[...new Set(values.filter(id=>IDS.includes(id)))]:[];
}
export function selectProjects(records,{query="",kind="all",access="all",savedOnly=false,saved=[]}={}){
  const needle=String(query).normalize("NFKC").trim().toLowerCase();
  const ids=normalizeSaved(saved);
  return IDS.filter(id=>{
    const p=records[id];if(!p)return false;
    if(kind!=="all"&&GROUP[id]!==kind)return false;
    if(access==="available"&&!p.link)return false;
    if(access==="development"&&p.link)return false;
    if(savedOnly&&!ids.includes(id))return false;
    if(needle){
      const words=[p.name,p.kind,p.phase,p.description,...(p.points||[])].join(" ").normalize("NFKC").toLowerCase();
      if(!words.includes(needle))return false;
    }
    return true;
  });
}
export function compareRows(records,ids){
  return normalizeSaved(ids).slice(0,3).map(id=>{
    const p=records[id];return p?{id,name:p.name,kind:p.kind,phase:p.phase,publicAccess:!!p.link,url:p.link||null,description:p.description}:null;
  }).filter(Boolean);
}
export function compareText(records,ids){
  return "Ravrent Interactive — project comparison\n"+compareRows(records,ids).map(p=>[
    p.name,"Category: "+p.kind,"Status: "+p.phase,
    "Public prototype: "+(p.url||"Not publicly available"),p.description
  ].join("\n")).join("\n\n")+"\n\nhttps://ravrentinteractive.vercel.app/";
}
function startExplorer(){
  const records=window.RavrentProjects;
  if(!records||!document.getElementById("directory"))return;
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const state={query:"",kind:"all",access:"all",savedOnly:false,saved:[],comparison:[]};
  const dialog=$("#compareDialog"),toast=$("#siteToast");
  let notice;
  try{state.saved=normalizeSaved(JSON.parse(localStorage.getItem(STORE)||"[]"))}catch{state.saved=[]}
  function notify(message){
    toast.textContent=message;toast.classList.add("shown");
    clearTimeout(notice);notice=setTimeout(()=>toast.classList.remove("shown"),2600);
  }
  function store(){
    try{localStorage.setItem(STORE,JSON.stringify(state.saved))}catch{/* storage is optional */}
  }
  function draw(){
    const visible=selectProjects(records,state);
    $$("[data-entry]").forEach(el=>{el.hidden=!visible.includes(el.dataset.entry)});
    $$("[data-filter-kind]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filterKind===state.kind)));
    $$("[data-filter-access]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filterAccess===state.access)));
    $("#savedOnly").setAttribute("aria-pressed",String(state.savedOnly));
    $$("[data-save]").forEach(b=>{
      const on=state.saved.includes(b.dataset.save);
      b.setAttribute("aria-pressed",String(on));
      b.setAttribute("aria-label",(on?"Remove ":"Save ")+records[b.dataset.save].name+(on?" from saved":" to saved"));
      b.title=on?"Remove saved project":"Save project";
    });
    $$("[data-compare]").forEach(b=>{
      const on=state.comparison.includes(b.dataset.compare);
      b.setAttribute("aria-pressed",String(on));
      b.setAttribute("aria-label",(on?"Remove ":"Add ")+records[b.dataset.compare].name+(on?" from comparison":" to comparison"));
      b.disabled=!on&&state.comparison.length===3;
    });
    $("#directoryEmpty").hidden=visible.length>0;
    $("#directoryCount").textContent="Showing "+visible.length+" of "+IDS.length+" projects";
    $("#compareCount").textContent=String(state.comparison.length);
    $("#launchCompare").disabled=state.comparison.length<2;
  }
  function reset(){
    state.query="";state.kind="all";state.access="all";state.savedOnly=false;
    $("#projectSearch").value="";draw();
  }
  function toggleCompare(id){
    if(state.comparison.includes(id))state.comparison=state.comparison.filter(x=>x!==id);
    else if(state.comparison.length<3)state.comparison.push(id);
    draw();
  }
  function showComparison(){
    const rows=compareRows(records,state.comparison);if(rows.length<2)return;
    let markup='<div class="compare-scroller"><table class="comparison-table"><thead><tr><th scope="col">Detail</th>'+
      rows.map(p=>'<th scope="col">'+p.name+'</th>').join("")+'</tr></thead><tbody>';
    for(const [label,fn] of [["Category",p=>p.kind],["Development stage",p=>p.phase],["Access",p=>p.publicAccess?"Public prototype":"Not publicly released"]]){
      markup+='<tr><th scope="row">'+label+'</th>'+rows.map(p=>'<td>'+fn(p)+'</td>').join("")+'</tr>';
    }
    markup+='</tbody></table></div><div class="comparison-cards">'+rows.map(p=>'<article><strong>'+p.name+'</strong><p>'+p.description+'</p>'+
      (p.url?'<a href="'+p.url+'" target="_blank" rel="noopener noreferrer">Open prototype ↗</a>':'<span>Not publicly released</span>')+'</article>').join("")+'</div>';
    $("#compareBody").innerHTML=markup;
    if(!dialog.open)dialog.showModal();
  }
  async function copy(value,success){
    try{await navigator.clipboard.writeText(value);notify(success)}catch{notify("Copy unavailable. Try the browser Share menu.")}
  }
  window.copyProjectUrl=id=>copy(location.origin+location.pathname+"#project/"+id,"Project link copied");
  $("#projectSearch").addEventListener("input",e=>{state.query=e.target.value;draw()});
  $$("[data-filter-kind]").forEach(b=>b.addEventListener("click",()=>{state.kind=b.dataset.filterKind;draw()}));
  $$("[data-filter-access]").forEach(b=>b.addEventListener("click",()=>{state.access=b.dataset.filterAccess;draw()}));
  $("#savedOnly").addEventListener("click",()=>{state.savedOnly=!state.savedOnly;draw()});
  $$("[data-save]").forEach(b=>b.addEventListener("click",()=>{
    const id=b.dataset.save;
    state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];
    store();draw();notify(records[id].name+(state.saved.includes(id)?" saved":" removed from saved"));
  }));
  $$("[data-compare]").forEach(b=>b.addEventListener("click",()=>toggleCompare(b.dataset.compare)));
  $("#launchCompare").addEventListener("click",showComparison);
  $$("[data-compare-close]").forEach(b=>b.addEventListener("click",()=>dialog.close()));
  $("#copyComparison").addEventListener("click",()=>copy(compareText(records,state.comparison),"Comparison copied"));
  $("#shareComparison").addEventListener("click",()=>copy(location.origin+location.pathname+"?compare="+state.comparison.join(","),"Comparison link copied"));
  $("#resetFilters").addEventListener("click",reset);
  $("#resetEmpty").addEventListener("click",reset);
  document.addEventListener("keydown",e=>{
    const el=document.activeElement;
    const typing=el?.matches?.("input,textarea,[contenteditable]")||el?.isContentEditable;
    if(e.key==="/"&&!typing&&!dialog.open&&!$("#projectDialog").open){e.preventDefault();$("#projectSearch").focus()}
    if(e.key==="Escape"&&el===$("#projectSearch")){el.value="";state.query="";draw();el.blur()}
  });
  document.documentElement.classList.add("explorer-ready");
  const fromUrl=new URLSearchParams(location.search).get("compare");
  if(fromUrl){const ids=normalizeSaved(fromUrl.split(",")).slice(0,3);if(ids.length>=2){state.comparison=ids;showComparison()}}
  draw();
}
if(typeof window!=="undefined")window.addEventListener("DOMContentLoaded",startExplorer,{once:true});
