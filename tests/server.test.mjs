import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FACILITIES,facilityByTier,facilityDetails,money} from "../server-exhibit.mjs";
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const js=readFileSync(new URL("../site.js",import.meta.url),"utf8");
test("Server Empire tier specs match verified Alpha 0.1 game",()=>{
  assert.deepEqual(FACILITIES.map(f=>f.name),["Garage Lab","Colocation Suite","Data Center Campus","Hyperscale Empire"]);
  assert.deepEqual(FACILITIES.map(f=>f.rackMax),[4,12,30,60]);
  assert.deepEqual(FACILITIES.map(f=>f.cost),[0,85000,420000,2100000]);
  assert.deepEqual(FACILITIES.map(f=>f.power),[12,42,110,275]);
  assert.deepEqual(FACILITIES.map(f=>f.cooling),[9,34,95,245]);
  assert.deepEqual(FACILITIES.map(f=>f.rent),[55,230,1150,5600]);
  assert.deepEqual(FACILITIES.map(f=>f.day),[1,14,70,180]);
  assert.deepEqual(FACILITIES.map(f=>f.rep),[0,58,70,82]);
});
test("facility preview formats real information without modifying game state",()=>{
  assert.equal(facilityDetails(1).cost,"Starting facility");
  assert.equal(facilityDetails(4).cost,"$2,100,000");
  assert.equal(facilityDetails(2).power,"42 kW");
  assert.equal(facilityDetails(3).cooling,"95 kW");
  assert.equal(facilityDetails(4).unlock,"Day 180+ · Reputation 82+");
  assert.equal(facilityByTier(999).tier,1);
  assert.equal(money(85000),"$85,000");
});
test("website links to verified playable data-center game, not private API",()=>{
  assert.match(js,/name:"Server Empire"/);
  assert.match(js,/https:\/\/server-empire\.vercel\.app\//);
  assert.match(html,/id="serverExhibit"/);
  for(let tier=1;tier<=4;tier++)assert.match(html,new RegExp('data-facility="'+tier+'"'));
  assert.match(html,/Selecting a tier here doesn't change your game or saved data/);
});
