// A product presentation of actual Studio Empire office tiers (not a playable game instance).
// Costs and capacities sourced from the Studio-Empire v0.8 app.js office arrays.
export const OFFICES=Object.freeze([
  Object.freeze({level:1,name:"Garage Studio",cost:0,capacity:4,description:"One founder, a small garage and a handful of desks. Your company starts here."}),
  Object.freeze({level:2,name:"Rented Workspace",cost:40000,capacity:6,description:"Pay for your first move, hire more people and take on a larger workload."}),
  Object.freeze({level:3,name:"Creative Loft",cost:115000,capacity:12,description:"A growing studio needs more floor space, a bigger team and stronger releases."}),
  Object.freeze({level:4,name:"Studio Campus",cost:340000,capacity:24,description:"Scale up to the largest office in the current build and run a studio with room for a much bigger team."})
]);
export function getOffice(level){return OFFICES.find(o=>o.level===Number(level))||OFFICES[0]}
export function officeCost(level){const o=getOffice(level);return o.cost===0?"Starting office":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(o.cost)}
function init(){
  const box=document.getElementById("empireExhibit");if(!box)return;
  const buttons=[...box.querySelectorAll("[data-empire-tier]")],floor=box.querySelector("#empireArt");
  const $=s=>box.querySelector(s);
  function display(level,focus=false){
    const o=getOffice(level);
    floor.dataset.level=String(o.level);
    $("#empireLevel").textContent=String(o.level).padStart(2,"0")+" / 04";
    $("#empireOffice").textContent=o.name;
    $("#empireCapacity").textContent=o.capacity+" staff capacity";
    $("#empireCost").textContent=officeCost(o.level);
    $("#empireDescription").textContent=o.description;
    floor.setAttribute("aria-label","Original illustration of "+o.name+", an office with capacity for "+o.capacity+" staff. This is a concept illustration, not gameplay footage.");
    buttons.forEach(b=>{
      const selected=Number(b.dataset.empireTier)===o.level;
      b.setAttribute("aria-selected",String(selected));
      b.tabIndex=selected?0:-1;
      b.classList.toggle("active",selected);
      if(focus&&selected)b.focus();
    });
  }
  buttons.forEach((b,i)=>{
    b.addEventListener("click",()=>display(Number(b.dataset.empireTier)));
    b.addEventListener("keydown",e=>{
      const delta=e.key==="ArrowRight"||e.key==="ArrowDown"?1:e.key==="ArrowLeft"||e.key==="ArrowUp"?-1:0;
      if(!delta&&e.key!=="Home"&&e.key!=="End")return;
      e.preventDefault();
      const next=e.key==="Home"?0:e.key==="End"?buttons.length-1:(i+delta+buttons.length)%buttons.length;
      display(Number(buttons[next].dataset.empireTier),true);
    });
  });
  display(1);
}
if(typeof document!=="undefined"){
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
}
