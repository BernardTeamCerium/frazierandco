# Frazier &amp; Co. — website &amp; brand

Static marketing site for Frazier &amp; Co., a marketing firm handling large-scale brand
campaign management, lead generation, growth systems and ad-platform monetization.

No build step, no dependencies — plain HTML, CSS and vanilla JS.

## Structure

```
index.html            Home page (hero, stats, services, systems, process, results, about, contact)
brand.html            Brand assets page — logo variants, palette, type, usage rules
assets/css/style.css  All styling (design tokens at the top of the file)
assets/js/main.js     Sticky nav, mobile menu, scroll reveals, stat count-up, contact form
assets/img/           Logo files
```

## Logo files

| File | Use |
| --- | --- |
| `assets/img/logo-mark.svg` | Monogram tile — avatars, app icons, tight spaces |
| `assets/img/logo-lockup-dark.svg` | Horizontal lockup for dark backgrounds (primary) |
| `assets/img/logo-lockup-light.svg` | Horizontal lockup for light backgrounds |
| `assets/img/favicon.svg` | Simplified monogram for 16–32px rendering |
| `assets/img/logo-mark-512.png` | 512px transparent PNG of the monogram — email signatures, decks, social avatars |
| `assets/img/og-image.png` | 1200×630 social share card |

The monogram is pure vector geometry, so it is font-independent. The wordmark in the
lockups uses live `<text>` set in Inter with a Helvetica/Arial fallback — fine for web
and for anything rendered in a browser. Before sending the lockup to a printer or an
outside vendor, convert the text to outlines (Illustrator/Figma: *Type → Create Outlines*)
so it can't reflow on a machine without Inter.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

Any static host works. For GitHub Pages: **Settings → Pages → Deploy from a branch**,
pick this branch and the `/` root. For a custom domain, add a `CNAME` file containing
`frazierandco.com` and point the DNS at the host.

## Things to update before launch

- **Email addresses** — `hello@frazierandco.com` and `newbusiness@frazierandco.com` are
  placeholders in `index.html`, `assets/js/main.js` and `brand.html`.
- **Contact form** — currently opens the visitor's mail client via `mailto:`. To capture
  submissions properly, point the `<form>` at a form service (Formspree, Basin, HubSpot)
  or your own endpoint, and drop the `submit` handler in `assets/js/main.js`.
- **Canonical / OG URLs** — the `<head>` of `index.html` points at `https://frazierandco.com/`.
  Update if the domain differs. The share card lives at `assets/img/og-image.png`; to
  regenerate it after a copy change, edit `tools/og-card.html` and run:

  ```bash
  chromium --headless=new --hide-scrollbars --window-size=1200,760 \
    --screenshot=assets/img/og-image.png tools/og-card.html
  # then crop the result to 1200x630
  ```
- **Claims** — the site states 9-figure media spend managed, 10+ years and hundreds of
  millions in business generated, per the brief. Keep language consistent with what you
  can substantiate if a prospect asks.
