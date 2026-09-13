# Saanjh Studio

A React + Vite saree storefront designed for static hosting on GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

## Add saree photos

Place product photos and `products.csv` in `public/sarees/`. The storefront reads each CSV row and finds its image in the same folder. Add another row to the CSV to add another product to the collection.

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. Run `npm run deploy`.
3. In GitHub, open **Settings → Pages** and choose the `gh-pages` branch as the source.

The Vite config uses a relative base path, so it works under a repository URL such as `https://username.github.io/repository-name/`.