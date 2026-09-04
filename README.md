# Frazier &amp; Co. — website &amp; brand

Static marketing site for Frazier &amp; Co., a marketing firm handling large-scale brand
campaign management, lead generation, growth systems and ad-platform monetization.

No build step, no dependencies — plain HTML, CSS and vanilla JS. Light palette:
white ground, ink navy type (`#0C1A2B`), one blue accent (`#1D4ED8`). Every colour is a
CSS custom property at the top of `assets/css/style.css` — changing the accent is a
one-line edit.

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
| `assets/img/logo-lockup-light.svg` | Horizontal lockup for light backgrounds (primary) |
| `assets/img/logo-lockup-dark.svg` | Reversed lockup for ink, photography and video |
| `assets/img/logo-mark-solid.svg` | Solid ink monogram tile — nav, avatars, app icons |
| `assets/img/logo-mark.svg` | Outline monogram tile — light surfaces, print |
| `assets/img/favicon.svg` | Simplified monogram for 16–32px rendering |
| `assets/img/logo-mark-512.png` | 512px transparent PNG of the solid monogram — email signatures, decks, avatars |
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

## Publishing (GitHub Pages)

This branch is the repository's default branch and the repo is public, so Pages can
serve it directly — no merge and no paid plan required.

**1. Turn Pages on.** Repo → **Settings** → **Pages** → *Build and deployment* →
Source: **Deploy from a branch** → Branch: `claude/frazier-co-logo-website-3g1y3b`,
folder: **/ (root)** → **Save**. First build takes a minute or two; the site then lives at

    https://bernardteamcerium.github.io/frazierandco/

Check it there first. Every push to this branch redeploys automatically.

**2. Point the domain.** `frazierandco.com` currently resolves to `198.143.165.187`, so
something is already hosted on it — confirm you're happy to replace it before switching.
When you are, at your DNS provider **replace** the existing A record(s) for the apex with
GitHub's four:

    A     @     185.199.108.153
    A     @     185.199.109.153
    A     @     185.199.110.153
    A     @     185.199.111.153
    CNAME www   bernardteamcerium.github.io

(Optional IPv6, as AAAA on `@`: `2606:50c0:8000::153`, `8001::153`, `8002::153`, `8003::153`.)

**3. Tell Pages about the domain.** Add a file named `CNAME` in the repo root containing
exactly `frazierandco.com`, or enter the domain under Settings → Pages → *Custom domain*
(which creates the same file). Do this **after** the DNS change — setting it earlier makes
the `github.io` URL redirect to a domain that isn't serving the new site yet.

**4. Tick "Enforce HTTPS"** once GitHub finishes issuing the certificate (usually minutes,
occasionally up to an hour).

`.nojekyll` is committed so Pages serves the files as-is instead of running them through
Jekyll. `404.html` is a branded not-found page; its links are root-absolute, so it behaves
correctly once the site is on the domain root.

## Wiring the contact form

The form posts through `assets/js/main.js`. Set one constant at the top of the contact
form block and it goes live:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
```

Create the form at [formspree.io](https://formspree.io) (free tier covers typical inbound
volume), point it at the address that should receive leads, and paste the endpoint above.
Submissions then post over `fetch` with an inline success message, a hidden honeypot field
filters bots, and any failure falls back to a "email us directly" message.

Left empty, the form opens the visitor's mail client instead — fine as a stopgap, weak for
lead capture.

## Things to update before launch

- **Email addresses** — `hello@frazierandco.com` and `newbusiness@frazierandco.com` are
  placeholders in `index.html`, `assets/js/main.js` and `brand.html`.
- **Contact form** — set `FORM_ENDPOINT` in `assets/js/main.js` (see above). Until then
  submissions fall back to the visitor's mail client.
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
