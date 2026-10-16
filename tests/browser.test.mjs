import test,{before,after} from "node:test";
import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {dirname,resolve,extname,sep} from "node:path";
import {mkdir} from "node:fs/promises";
import {chromium} from "playwright";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
let server,browser,base;
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".webmanifest":"application/manifest+json"};
before(async()=>{
  server=createServer(async(req,res)=>{
    const url=new URL(req.url,"http://localhost");
    const file=resolve(root,"."+decodeURIComponent(url.pathname==="/"?"/index.html":url.pathname));
    if(!file.startsWith(root+sep)){res.writeHead(403).end();return}
    try{const data=await readFile(file);res.writeHead(200,{"Content-Type":mime[extname(file)]||"application/octet-stream","Cache-Control":"no-cache"});res.end(data)}
    catch{res.writeHead(404).end()}
  });
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  base="http://127.0.0.1:"+server.address().port;
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  await mkdir(resolve(root,"test-results"),{recursive:true});
});
after(async()=>{
  await browser?.close();
  await new Promise(resolve=>server?.close(resolve));
});
async function pageAt(width,height){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:"reduce"});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(base+"/",{waitUntil:"networkidle"});
  await page.waitForFunction(()=>document.documentElement.classList.contains("explorer-ready"));
  return {page,errors};
}
test("desktop project directory, filter and compare flow",async()=>{
  const {page,errors}=await pageAt(1440,900);
  assert.equal(await page.locator("[data-entry]").count(),6);
  await page.locator('[data-filter-kind="game"]').click();
  assert.equal(await page.locator("[data-entry]:visible").count(),4);
  await page.locator('[data-filter-kind="all"]').click();
  await page.locator('#projectSearch').fill("game development");
  assert.equal(await page.locator("[data-entry]:visible").count(),1);
  assert.equal(await page.locator('[data-entry="empire"]:visible').count(),1);
  await page.locator("#resetFilters").click();
  await page.locator('[data-compare="empire"]').click();
  await page.locator('[data-compare="motor"]').click();
  await page.locator("#launchCompare").click();
  assert.equal(await page.locator("#compareDialog").evaluate(el=>el.open),true);
  assert.match(await page.locator("#compareDialog").innerText(),/Studio Empire/);
  assert.match(await page.locator("#compareDialog").innerText(),/Motor Dynasty/);
  await page.locator("[data-compare-close]").click();
  assert.equal(errors.length,0,errors.join("\n"));
  await page.screenshot({path:resolve(root,"test-results","desktop.png"),fullPage:true,animations:"disabled"});
  await page.close();
});
test("office progression reflects the real four tiers and costs",async()=>{
  const {page,errors}=await pageAt(1280,850);
  await page.locator("#empire").scrollIntoViewIfNeeded();
  await page.locator('[data-empire-tier="4"]').click();
  assert.equal(await page.locator("#empireOffice").innerText(),"Studio Campus");
  assert.match(await page.locator("#empireCost").innerText(),/\$340,000/);
  assert.match(await page.locator("#empireCapacity").innerText(),/24 staff/);
  assert.equal(await page.locator("#empireArt").getAttribute("data-level"),"4");
  await page.locator('[data-empire-tier="4"]').press("ArrowLeft");
  assert.equal(await page.locator("#empireOffice").innerText(),"Creative Loft");
  assert.match(await page.locator("#empireCost").innerText(),/\$115,000/);
  const link=page.locator('#empire a[href*="studio-empire-omega"]');
  assert.equal(await link.getAttribute("target"),"_blank");
  assert.equal(errors.length,0,errors.join("\n"));
  await page.close();
});
test("project brief and persistent saved project remain functional",async()=>{
  const {page,errors}=await pageAt(390,844);
  await page.locator('[data-save="empire"]').click();
  await page.reload({waitUntil:"networkidle"});
  await page.waitForFunction(()=>document.documentElement.classList.contains("explorer-ready"));
  await page.locator("#savedOnly").click();
  assert.equal(await page.locator("[data-entry]:visible").count(),1);
  await page.locator("#savedOnly").click();
  await page.locator('[data-project="empire"]').click();
  assert.equal(await page.locator("#projectDialog").evaluate(el=>el.open),true);
  assert.match(await page.locator("#projectDialog").innerText(),/Studio Empire/);
  assert.match(await page.locator("#projectDialog").innerText(),/Playable development build/);
  await page.locator("[data-close-modal]").click();
  assert.equal(errors.length,0,errors.join("\n"));
  await page.screenshot({path:resolve(root,"test-results","mobile.png"),fullPage:true,animations:"disabled"});
  await page.close();
});
test("small mobile viewport has working navigation without horizontal overflow",async()=>{
  const {page,errors}=await pageAt(320,690);
  await page.locator("#menuToggle").click();
  assert.equal(await page.locator("#mobileNav").isVisible(),true);
  await page.locator('#mobileNav a[href="#empire"]').click();
  assert.equal(await page.locator("#mobileNav").isVisible(),false);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=2,"horizontal overflow "+overflow+" px");
  assert.equal(errors.length,0,errors.join("\n"));
  await page.close();
});
