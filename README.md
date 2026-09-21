# Astuti Ping Pro — Site comercial

Microsite comercial oficial do **Astuti Ping Pro**.

## Stack
- HTML5
- CSS3
- JavaScript puro
- Netlify

Não há processo de build, backend, banco de dados ou dependências de produção.

## Estrutura
- `site/index.html` — landing page.
- `site/suporte/` — suporte oficial por e-mail.
- `site/termos/` — termos de uso.
- `site/privacidade/` — política de privacidade.
- `site/assets/` — CSS, JavaScript e imagens.
- `netlify.toml` — configuração de deploy e cabeçalhos.
- `robots.txt` e `sitemap.xml` — SEO.

## Dados comerciais
- Preço normal: R$ 597,00.
- Preço de lançamento: R$ 397,00.
- Trial: 7 dias.
- Compra: WhatsApp +55 11 99669-8775.
- Suporte: astutigestaodeti@gmail.com.

## Download
O botão aponta para:

`https://downloads.astutigestaodeti.com.br/AstutiPingProSetup.exe`

O instalador deve ser hospedado fora do deploy do site. A arquitetura planejada usa **Cloudflare R2** no subdomínio `downloads.astutigestaodeti.com.br`.

## Publicação na Netlify
1. Conecte este repositório à Netlify.
2. Production branch: `main`.
3. Build command: deixe vazio.
4. Publish directory: `site`
5. Após o deploy de teste, adicione o domínio `ping.astutigestaodeti.com.br`.
6. No Cloudflare DNS, aponte `ping` para o hostname fornecido pela Netlify.

## Atualizar screenshots
Substitua os arquivos em `assets/img/screens/` mantendo os mesmos nomes para evitar mudanças no HTML.

## Observação
As telas reais do produto podem mudar entre versões. O site informa explicitamente que o Astuti Ping Pro está em evolução contínua.
