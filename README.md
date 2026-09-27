# baorlys.dev

Source for my portfolio site, live at https://baorlys.dev.

The site is one page with a 3D scene for each section: a service network for the intro, a bank card for the digital bank work, a phone with mini-apps for the super app, and a ring of coins for the loyalty platform. Scrolling snaps from section to section, and each scene slides in from the direction you scroll.

## Stack

React 19, Vite, Tailwind CSS v4, three.js through React Three Fiber and drei, postprocessing for bloom, and Motion for the text reveals.

## Run it

```bash
pnpm install
pnpm dev
```

`pnpm build` writes a static site to `dist/`.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`. The custom domain is set in `public/CNAME`.

## Credits

The burger, donut, cupcake, taxi and delivery van models come from Kenney's Food Kit and Car Kit, released under CC0. The license file is in `public/models/`.
