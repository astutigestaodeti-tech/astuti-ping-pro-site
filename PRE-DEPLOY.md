# Checklist de publicação — Astuti Ping Pro

## 1. Download do instalador
O site está configurado para:

`https://downloads.astutigestaodeti.com.br/AstutiPingProSetup.exe`

Antes de divulgar o site:
- criar um bucket no Cloudflare R2;
- enviar o `AstutiPingProSetup.exe` atual;
- associar o subdomínio `downloads.astutigestaodeti.com.br`;
- testar o download em janela anônima;
- manter o mesmo nome do arquivo ao publicar novas versões, se quiser preservar o link do site.

## 2. Netlify
- conectar o repositório `astuti-ping-pro-site`;
- branch de produção: `main`;
- build command: vazio;
- publish directory: `site`;
- fazer o primeiro deploy;
- testar a URL temporária `.netlify.app`.

## 3. Domínio
Depois do deploy de teste:
- adicionar `ping.astutigestaodeti.com.br` como domínio personalizado na Netlify;
- no Cloudflare DNS, criar o registro solicitado pela Netlify;
- aguardar validação e HTTPS;
- confirmar `https://ping.astutigestaodeti.com.br`.

## 4. Testes comerciais
- botão **Baixar grátis por 7 dias** inicia o download;
- botão **Comprar pelo WhatsApp** abre `+55 11 99669-8775`;
- mensagem de compra contém o preço promocional de R$ 397,00;
- suporte aponta somente para `astutigestaodeti@gmail.com`;
- preço normal R$ 597,00 aparece riscado;
- preço de lançamento R$ 397,00 está em destaque.

## 5. Testes de conteúdo
- screenshots correspondem à versão que se deseja apresentar;
- aviso de evolução contínua permanece visível;
- Termos de Uso e Política de Privacidade foram revisados antes da publicação comercial;
- não publicar chaves `.pem`, arquivos `.license`, senhas, tokens ou credenciais SMTP.

## 6. Atualizações futuras
Para trocar o instalador sem alterar o site, substitua o objeto no R2 mantendo:

`AstutiPingProSetup.exe`

Para mudar preço, WhatsApp, texto ou screenshots, altere o repositório e publique um novo deploy da Netlify.
