
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"

def load(rel):
    return (SITE / rel).read_text(encoding="utf-8")

def soup(rel):
    return BeautifulSoup(load(rel), "html.parser")

def assert_exists(rel, base=SITE):
    p = base / rel
    assert p.exists(), f"missing: {rel}"
    return p

def run():
    index = load("index.html")
    s = soup("index.html")

    required = [
        "Saiba quando sua rede cair.",
        "R$ 597,00",
        "R$ 397,00",
        "Baixar grátis por 7 dias",
        "Comprar pelo WhatsApp",
        "Pontos ilimitados",
        "Licença perpétua",
        "Sem mensalidade",
        "astutigestaodeti@gmail.com",
        "evolução contínua",
    ]
    for text in required:
        assert text in index, f"missing required copy: {text}"

    assert "5511996698775" in index, "commercial WhatsApp number missing"
    assert "https://downloads.astutigestaodeti.com.br/AstutiPingProSetup.exe" in index

    screens = list((SITE / "assets/img/screens").glob("*.webp"))
    assert len(screens) == 9, f"expected 9 screenshots, got {len(screens)}"

    expected_files = [
        "assets/css/site.css",
        "assets/js/site.js",
        "assets/img/favicon.svg",
        "assets/img/og-card.jpg",
        "suporte/index.html",
        "termos/index.html",
        "privacidade/index.html",
        "404.html",
        "robots.txt",
        "sitemap.xml",
    ]
    for f in expected_files:
        assert_exists(f)
    assert_exists("netlify.toml", ROOT)
    assert_exists("README.md", ROOT)

    # Internal hrefs from all HTML pages must resolve, excluding anchors/mail/external.
    html_files = [SITE/"index.html", SITE/"404.html", SITE/"suporte/index.html",
                  SITE/"termos/index.html", SITE/"privacidade/index.html"]
    for file in html_files:
        doc = BeautifulSoup(file.read_text(encoding="utf-8"), "html.parser")
        for tag in doc.find_all("a", href=True):
            href = tag["href"]
            if href.startswith(("http://","https://","mailto:","#")):
                continue
            path = href.split("#", 1)[0].split("?", 1)[0]
            if not path:
                continue
            if path.startswith("/"):
                target = SITE / path.lstrip("/")
            else:
                target = file.parent / path
            if path.endswith("/"):
                target = target / "index.html"
            elif target.is_dir():
                target = target / "index.html"
            assert target.exists(), f"broken internal link {href} in {file.relative_to(ROOT)}"

    # All local images referenced must exist and have alt text where relevant.
    for file in html_files:
        doc = BeautifulSoup(file.read_text(encoding="utf-8"), "html.parser")
        for img in doc.find_all("img"):
            src = img.get("src","")
            if src.startswith("/"):
                assert (SITE/src.lstrip("/")).exists(), f"missing image {src}"
            assert img.has_attr("alt"), f"image without alt in {file.name}"

    # FAQ stays functional without JS by using native details/summary.
    details = s.select("#faq details")
    assert len(details) >= 12, f"FAQ too small: {len(details)}"
    assert all(d.find("summary") for d in details)

    # Support separation: support page must say email, not promise WhatsApp support.
    support = load("suporte/index.html")
    assert "exclusivamente por e-mail" in support
    assert "astutigestaodeti@gmail.com" in support
    assert "Compra da licença" in support

    # Privacy must not claim configured analytics.
    privacy = load("privacidade/index.html")
    assert "não foram configuradas ferramentas próprias de analytics" in privacy

    # SEO essentials.
    assert s.find("link", rel="canonical")
    assert s.find("meta", attrs={"property":"og:image"})
    assert s.find("script", attrs={"type":"application/ld+json"})
    assert "sitemap.xml" in load("robots.txt")

    print("PASS: static site checks")
    print(f"PASS: {len(screens)} optimized screenshots")
    print(f"PASS: {len(details)} FAQ entries")
    print("PASS: internal links and local image references")

if __name__ == "__main__":
    run()
