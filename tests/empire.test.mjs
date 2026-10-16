import test from "node:test";
import assert from "node:assert/strict";
import {OFFICES,getOffice,officeCost} from "../empire-exhibit.mjs";
import {readFileSync} from "node:fs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
test("actual four Studio Empire office levels and in-game costs",()=>{
 assert.deepEqual(OFFICES.map(o=>o.name),["Garage Studio","Rented Workspace","Creative Loft","Studio Campus"]);
 assert.deepEqual(OFFICES.map(o=>o.cost),[0,40000,115000,340000]);
 assert.deepEqual(OFFICES.map(o=>o.capacity),[4,6,12,24]);
 assert.equal(officeCost(1),"Starting office");
 assert.equal(officeCost(4),"$340,000");
 assert.equal(getOffice(99).level,1);
});
test("portfolio exposes four accessible office-preview controls",()=>{
 for(let n=1;n<=4;n++)assert.match(html,new RegExp('data-empire-tier="'+n+'"'));
 assert.match(html,/Studio Empire/);
 assert.match(html,/studio-empire-omega\.vercel\.app/);
 assert.match(html,/actual upgrades must be purchased during gameplay/);
});
