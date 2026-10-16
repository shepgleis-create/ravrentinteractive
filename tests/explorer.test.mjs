import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {normalizeSaved,selectProjects,compareRows,compareText} from "../explorer.mjs";
const js=readFileSync(new URL("../site.js",import.meta.url),"utf8");
const model={
 mechanic:{name:"Ravrent Mechanic",kind:"Automotive assistant",phase:"Private beta",description:"Car symptoms repair",points:["Vehicle history"],link:null},
 outmile:{name:"Outmile",kind:"Mapping",phase:"Prototype",description:"Road trip and trails",points:["Off-road"],link:"https://example.org/outmile"},
 motor:{name:"Motor Dynasty",kind:"Simulation",phase:"Playable",description:"Vehicle factory",points:["Production"],link:"https://example.org/motor"},
 empire:{name:"Studio Empire",kind:"Game development simulator",phase:"Development build",description:"Garage office game creation",points:["Publisher"],link:"https://studio-empire-omega.vercel.app/"},
 block:{name:"Block Frontier",kind:"Sandbox",phase:"Early prototype",description:"Block mining",points:["Survival"],link:"https://example.org/block"},
 life:{name:"Life OS",kind:"Life simulation",phase:"Development",description:"Business and economy",points:["Company"],link:null}
};
test("studio exposes existing catalog without duplicated project records",()=>{
 assert.match(js,/window\.RavrentProjects=Object\.freeze\(projects\)/);
 assert.equal(selectProjects(model).length,6);
});
test("category filters retain the correct application and game groups",()=>{
 assert.deepEqual(selectProjects(model,{kind:"app"}),["mechanic","outmile"]);
 assert.deepEqual(selectProjects(model,{kind:"game"}),["motor","empire","block","life"]);
});
test("try now only shows publicly available prototypes",()=>{
 assert.deepEqual(selectProjects(model,{access:"available"}),["outmile","motor","empire","block"]);
 assert.deepEqual(selectProjects(model,{access:"development"}),["mechanic","life"]);
});
test("case-insensitive title, feature and description matching",()=>{
 assert.deepEqual(selectProjects(model,{query:"vEhIcLe"}),["mechanic","motor"]);
 assert.deepEqual(selectProjects(model,{query:"  ROAD TRIP  "}),["outmile"]);
 assert.deepEqual(selectProjects(model,{query:"nonexistent nonsense"}),[]);
});
test("saved project IDs are normalized and allow combined filters",()=>{
 assert.deepEqual(normalizeSaved(["motor","motor","unknown","life"]),["motor","life"]);
 assert.deepEqual(normalizeSaved({}),[]);
 assert.deepEqual(selectProjects(model,{savedOnly:true,saved:["life","unknown"]}),["life"]);
 assert.deepEqual(selectProjects(model,{kind:"app",access:"available"}),["outmile"]);
 assert.deepEqual(selectProjects(model,{kind:"game",savedOnly:true,saved:["mechanic","block"]}),["block"]);
});
test("comparison caps at three and never fabricates access",()=>{
 const rows=compareRows(model,["mechanic","outmile","motor","block"]);
 assert.equal(rows.length,3);
 assert.equal(rows[0].publicAccess,false);
 assert.equal(rows[1].publicAccess,true);
 assert.equal(rows[0].url,null);
 assert.match(compareText(model,["mechanic","motor"]),/Not publicly available/);
 assert.match(compareText(model,["mechanic","motor"]),/https:\/\/example\.org\/motor/);
});

test("Studio Empire is searchable, saved, comparable and publicly linked",()=>{
  assert.deepEqual(selectProjects(model,{query:"garage"}),["empire"]);
  assert.deepEqual(selectProjects(model,{savedOnly:true,saved:["empire"]}),["empire"]);
  assert.equal(compareRows(model,["empire","motor"])[0].publicAccess,true);
  assert.match(compareText(model,["empire","motor"]),/studio-empire-omega\.vercel\.app/);
});
