# Sadguru Tyres website

Website for Sadguru Tyres, a tyre and wheel service shop in Dombivli East (Maharashtra). Plain HTML, CSS and JavaScript with no build step.

Live site: https://sadguru-tyres.vercel.app

## What is in the site

- Hero with a quote form that opens WhatsApp with the customer's details filled in
- 14 tyre brand logos, services, a tyre size finder, FAQs and customer reviews
- 16-photo gallery (customer number plates are blurred) with a full-screen viewer
- Quick-service section that highlights fast, precise wheel alignment and balancing (no service times shown)
- Language dropdown: English, Marathi, Hindi, Gujarati and Sindhi (Devanagari). Translations live in `i18n.js`; customer reviews, names and addresses are not translated
- Dark theme by default, with a light option the visitor can switch to
- Local search setup: page tags, business and FAQ structured data, `sitemap.xml`, `robots.txt`, share image

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The whole page, including the search tags and structured data |
| `styles.css` | All styling, both themes, responsive rules |
| `i18n.js` | Language dropdown and all translations. Edit a phrase here to fix a translation. Urdu is written but switched off (see `ENABLED`) |
| `script.js` | Loading screen, theme switch, forms, finder, gallery viewer, QR code |
| `images/` | Logos, brand logos, gallery photos, hero image, share image |
| `vercel.json` | Caching and security headers for Vercel |
| `sitemap.xml`, `robots.txt` | For search engines |

## Run it locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Deploy

The site is hosted on Vercel (project `sadguru-tyres`).

```bash
npx vercel deploy --prod --yes
```

`.vercelignore` keeps private and non-site files out of the deploy. Put anything that is not part of the website, such as reports, PDFs and spreadsheets, in the `reports` folder.

## Where to change common details

- **Call number:** `tel:` links in `index.html`, and the contact file in `script.js`
- **WhatsApp number:** `wa.me` links in `index.html` and the `WA` value at the top of `script.js`
- **Address and map point:** the Visit section, the footer and the structured data in `index.html`
- **Brands:** the `brand-grid` list in `index.html`, with logos in `images/brands/`
- **Gallery photos:** the `gallery` list in `index.html`, with files in `images/gallery/`
- **Web address:** the canonical link, share tags, structured data and `sitemap.xml` use `https://sadguru-tyres.vercel.app`. Change them all when a custom domain is added.

## Still to confirm with the owner

- Opening and closing hours, including Friday
- Which brands are supplied, since the site says 14
- Payment methods, parking and an email address
- A native speaker should proofread the Marathi, Hindi, Gujarati and especially the Sindhi translations
