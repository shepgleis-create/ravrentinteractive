import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("index.html"),css=read("site.css"),js=read("site.js"),sw=read("sw.js");
const products=["mechanic","outmile","motor","empire","block","life"];

test("site references its versioned source and has semantic structure",()=>{
  assert.match(html,/<!doctype html>/i);
  assert.match(html,/<main\s+id="main"/);
  assert.match(html,/<nav[^>]+aria-label="Main navigation"/);
  assert.match(html,/site\.css\?v=10/);
  assert.match(html,/site\.js\?v=10/);
});
test("all six project sections and detail entries exist",()=>{
  for(const id of products){
    assert.match(html,new RegExp('id="'+id+'"'));
    assert.match(js,new RegExp('^\\s*'+id+':\\s*\\{',"m"));
    assert.match(html,new RegExp('data-project="'+id+'"'));
  }
});
test("public prototype links use safe new-tab attributes",()=>{
  for(const url of ["https://ravrent-explore.vercel.app/","https://motor-eta-six.vercel.app/","https://block-frontier.hatchable.site","https://studio-empire-omega.vercel.app/"]){
    assert.ok(html.includes(url),url+" must appear");
  }
  assert.equal((html.match(/target="_blank"/g)||[]).length,(html.match(/rel="noopener noreferrer"/g)||[]).length);
});
test("private software has no public access link",()=>{
  const source=html+"\n"+js;
  assert.doesNotMatch(source,/ravrent-mechanic\.vercel\.app|ai-trader|AI Trader|lottery\.hatchable\.site/i);
  assert.match(source,/Private beta/);
  assert.match(html,/Lottery Intelligence Lab — not publicly accessible/);
  assert.equal((html.match(/Lottery Intelligence Lab/g)||[]).length,1);
});
test("demo content is explicitly labeled illustrative, not live",()=>{
  assert.match(html,/FICTIONAL TERRAIN/);
  assert.match(html,/NOT A GPS SERVICE/);
  assert.match(html,/NOT LIVE AI/);
  assert.match(html,/NOT AN IN-GAME SCREENSHOT/);
});
test("responsive and accessibility support remain present",()=>{
  assert.match(html,/Skip to content/);
  assert.match(html,/<dialog id="projectDialog"/);
  assert.match(css,/@media\(max-width:560px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(js,/document\.documentElement\.classList\.add\("has-js"\)/);
  assert.match(js,/aria-pressed/);
  assert.match(js,/aria-selected/);
});
test("service worker uses a stable versioned network-first strategy",()=>{
  assert.match(sw,/ravrent-v10-20261015/);
  assert.match(sw,/fetch\(request\)/);
  assert.doesNotMatch(sw,/unregister\(\)|clients\.navigate/);
});

test("accessible project explorer controls are present",()=>{
 for(const id of ["directory","projectSearch","savedOnly","directoryEmpty","directoryCount","compareDialog","compareBody","launchCompare"]){
   assert.match(html,new RegExp('id="'+id+'"'));
 }
 assert.match(html,/explorer\.mjs\?v=10/);
 for(const id of products){
   assert.match(html,new RegExp('data-save="'+id+'"'));
   assert.match(html,new RegExp('data-compare="'+id+'"'));
   assert.match(html,new RegExp('<a href="#'+id+'">'));
 }
});

test("decorative canvases stop background rendering offscreen",()=>{
  assert.match(js,/mapVisible=entry\.isIntersecting/);
  assert.match(js,/heroVisible=entry\.isIntersecting/);
  assert.match(js,/visibility\.observe\(terrain\)/);
  assert.match(js,/visibility\.observe\(heroCanvas\)/);
});

test("Studio Empire uses real gameplay link and four labeled office tiers",()=>{
  assert.match(html,/id="empireExhibit"/);
  assert.match(html,/empire-exhibit\.mjs\?v=10/);
  assert.match(html,/SIX PROJECTS/);
  assert.match(html,/FOUR GAMES/);
  for(let tier=1;tier<=4;tier++)assert.match(html,new RegExp('data-empire-tier="'+tier+'"'));
  assert.match(html,/Prices and staffing caps reflect the current game build/);
  assert.match(css,/\.empire-render\[data-level="4"\]/);
});

test("route selector initialization uses querySelectorAll for iterated listeners",()=>{
 assert.match(js,/\$\$\("\[data-map-route\]"\)\.forEach\(b=>b\.addEventListener/);
 assert.doesNotMatch(js,/(?<!\$)\$\("\[data-map-route\]"\)\.forEach\(b=>b\.addEventListener/);
});
