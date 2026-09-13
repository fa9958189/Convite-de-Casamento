# Casamento de Philipe & Vanessa

Primeira etapa do convite: React, Vite e TypeScript. Fontes hospedadas junto à aplicação, decoração botânica em SVG e foto otimizada em WebP.

## Executar

```sh
npm install
npm run dev
```

Abra http://localhost:4175. A capa fica em `/` e o convite em `/convite`.

```sh
npm run build
npm run preview
npm test
```

Os testes Playwright utilizam o Google Chrome instalado. Conferem três tamanhos de tela, navegação, teclado, movimento reduzido, ausência de rolagem horizontal e carregamento direto da página interna.

## Alterações futuras

- `src/config/wedding.ts`: nomes, textos, foto, data, horário e local.
- `src/components/Cover.tsx`: capa e transição do envelope.
- `src/components/WaxSeal.tsx`: botão do selo.
- `src/components/FloralFrame.tsx`: decoração SVG substituível.
- `src/components/Invitation.tsx`: página interna.
- `src/styles.css`: identidade visual e responsividade.

A foto `Fotos/IMG_6553.JPG` foi selecionada após inspeção das cinco imagens. Os originais permanecem intactos; `public/images/casal.webp` é a cópia otimizada em 960 × 1280. Nenhuma data, horário ou localização foi definida.

## Vercel

Utilize o preset Vite, comando de build `npm run build` e pasta de saída `dist`. `vercel.json` inclui o fallback para a aplicação, permitindo acessar `/convite` diretamente. A publicação não foi realizada nesta etapa.
