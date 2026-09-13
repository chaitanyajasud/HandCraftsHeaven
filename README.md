# Saanjh Studio

A React + Vite saree storefront designed for static hosting on GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

## Add saree photos

Place product photos in `public/sarees/` using the filenames listed in `public/sarees/README.md`. The storefront reads every product image from that single folder, and prices are managed alongside each product in `src/main.jsx`.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. Run `npm run deploy`.
3. In GitHub, open **Settings → Pages** and choose the `gh-pages` branch as the source.

The Vite config uses a relative base path, so it works under a repository URL such as `https://username.github.io/repository-name/`.