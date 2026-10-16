// Server Empire facility preview uses values from the live Alpha 0.1 game.js.
// It never reads or writes actual gameplay saves.
export const FACILITIES=Object.freeze([
  Object.freeze({tier:1,name:"Garage Lab",rackMax:4,cost:0,day:1,rep:0,rent:55,power:12,cooling:9,description:"Your first compute nodes in a small, privately operated lab."}),
  Object.freeze({tier:2,name:"Colocation Suite",rackMax:12,cost:85000,day:14,rep:58,rent:230,power:42,cooling:34,description:"A commercial facility with room for additional customer demand."}),
  Object.freeze({tier:3,name:"Data Center Campus",rackMax:30,cost:420000,day:70,rep:70,rent:1150,power:110,cooling:95,description:"An enterprise campus with larger capacity and dedicated operations."}),
  Object.freeze({tier:4,name:"Hyperscale Empire",rackMax:60,cost:2100000,day:180,rep:82,rent:5600,power:275,cooling:245,description:"A computing complex built to serve growing worldwide demand."})
]);
export const facilityByTier=tier=>FACILITIES.find(f=>f.tier===Number(tier))||FACILITIES[0];
export const money=value=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
export function facilityDetails(tier){
  const f=facilityByTier(tier);
  return {name:f.name,tier:f.tier,racks:f.rackMax,cost:f.cost?money(f.cost):"Starting facility",power:f.power+" kW",cooling:f.cooling+" kW",rent:money(f.rent)+"/day",unlock:f.tier===1?"Start":"Day "+f.day+"+ · Reputation "+f.rep+"+",description:f.description};
}
function initializeFacility(){
  const root=document.getElementById("serverExhibit");if(!root)return;
  const tabs=[...root.querySelectorAll("[data-facility]")];
  const $=selector=>root.querySelector(selector);
  const rackGrid=$("#serverRackGrid"),diagram=$("#serverDiagram");
  function render(tier,moveFocus=false){
    const f=facilityDetails(tier);
    $("#serverFacilityName").textContent=f.name;
    $("#serverFacilityDescription").textContent=f.description;
    $("#serverRackMax").textContent=String(f.racks);
    $("#serverPower").textContent=f.power;
    $("#serverCooling").textContent=f.cooling;
    $("#serverUnlock").textContent=f.unlock;
    $("#serverBuildCost").textContent=f.cost;
    $("#serverFacilityNumber").textContent=String(f.tier).padStart(2,"0")+" / 04";
    diagram.dataset.tier=String(f.tier);
    diagram.setAttribute("aria-label","Illustrative "+f.name+" facility with up to "+f.racks+" racks. Not actual gameplay.");
    rackGrid.replaceChildren();
    const count=Math.min(f.racks,12);
    for(let i=0;i<count;i++){
      const rack=document.createElement("span");
      rack.className="server-rack";
      rack.setAttribute("aria-hidden","true");
      rack.style.setProperty("--rack-index",String(i));
      rackGrid.append(rack);
    }
    $("#serverMoreRacks").textContent=f.racks>count?"+"+(f.racks-count)+" additional rack slots":"All rack slots shown";
    tabs.forEach(tab=>{
      const selected=Number(tab.dataset.facility)===f.tier;
      tab.setAttribute("aria-selected",String(selected));
      tab.tabIndex=selected?0:-1;
      tab.classList.toggle("active",selected);
      if(selected&&moveFocus)tab.focus();
    });
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener("click",()=>render(tab.dataset.facility));
    tab.addEventListener("keydown",event=>{
      const delta=(event.key==="ArrowRight"||event.key==="ArrowDown")?1:(event.key==="ArrowLeft"||event.key==="ArrowUp")?-1:0;
      if(!delta&&event.key!=="Home"&&event.key!=="End")return;
      event.preventDefault();
      const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:(index+delta+tabs.length)%tabs.length;
      render(tabs[next].dataset.facility,true);
    });
  });
  render(1);
}
if(typeof document!=="undefined"){
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initializeFacility,{once:true});
  else initializeFacility();
}