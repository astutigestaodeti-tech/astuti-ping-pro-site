
import asyncio, json, base64, mimetypes, re
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT/"site"
ART = ROOT/"tests/artifacts"
ART.mkdir(parents=True, exist_ok=True)

html = (SITE/"index.html").read_text(encoding="utf-8")
css = (SITE/"assets/css/site.css").read_text(encoding="utf-8")
js = (SITE/"assets/js/site.js").read_text(encoding="utf-8")

html = html.replace('<link rel="stylesheet" href="/assets/css/site.css">', f'<style>{css}</style>')
html = html.replace('<script src="/assets/js/site.js" defer></script>', '')

def to_data_uri(path):
    p = SITE / path.lstrip("/")
    mime = mimetypes.guess_type(p.name)[0] or "application/octet-stream"
    data = base64.b64encode(p.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{data}"

asset_paths = set(re.findall(r'/(assets/img/[^"\']+)', html))
for rel in sorted(asset_paths, key=len, reverse=True):
    uri = to_data_uri(rel)
    html = html.replace("/"+rel, uri)

html = html.replace("</body>", f"<script>{js}</script></body>")

async def main():
    results = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path="/usr/bin/chromium",
            args=["--no-sandbox"]
        )
        for name,w,h in [("desktop",1440,1000),("tablet",768,1024),("mobile",390,844)]:
            page = await browser.new_page(viewport={"width":w,"height":h})
            errors=[]
            page.on("console", lambda msg: errors.append(f"console:{msg.type}:{msg.text}") if msg.type=="error" else None)
            page.on("pageerror", lambda exc: errors.append(f"pageerror:{exc}"))
            await page.set_content(html, wait_until="load")
            overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            h1 = await page.locator("h1").inner_text()
            price = await page.locator(".launch-price").inner_text()
            await page.screenshot(path=str(ART/f"{name}.png"), full_page=True)
            results[name]={"overflow":overflow,"h1":h1,"price":price,"errors":errors}
            await page.close()

        page = await browser.new_page(viewport={"width":1440,"height":900})
        await page.set_content(html, wait_until="load")
        await page.locator("[data-lightbox]").first.click()
        lightbox_open = await page.locator("#lightbox").evaluate("el => el.open")
        await page.keyboard.press("Escape")
        lightbox_closed = not await page.locator("#lightbox").evaluate("el => el.open")

        detail = page.locator("#faq details").first
        await detail.locator("summary").click()
        faq_open = await detail.evaluate("el => el.open")

        m = await browser.new_page(viewport={"width":390,"height":844})
        await m.set_content(html, wait_until="load")
        await m.locator(".nav-toggle").click()
        nav_class = await m.locator(".main-nav").get_attribute("class")
        nav_open = "open" in (nav_class or "")

        results["interactions"]={
            "lightbox_open":lightbox_open,
            "lightbox_closed_escape":lightbox_closed,
            "faq_open":faq_open,
            "mobile_nav_open":nav_open,
        }
        await browser.close()

    print(json.dumps(results,ensure_ascii=False,indent=2))
    assert all(not results[k]["overflow"] for k in ("desktop","tablet","mobile"))
    assert all(not results[k]["errors"] for k in ("desktop","tablet","mobile"))
    assert lightbox_open and lightbox_closed and faq_open and nav_open

asyncio.run(main())
