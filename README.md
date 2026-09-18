# bgvera

Next.js App Router background-removal app. Images are processed on-device with Transformers.js and RMBG-1.4; only model files are downloaded. WebGPU is preferred, with a WASM fallback.

## Run

```sh
bun install
bun run dev
```

Open http://localhost:3000. The dark landing page transitions into the editor in place. Select a JPG, PNG, or WebP up to 20 MB, inspect the before/after slider, and download a transparent PNG. Background swatches change only the preview.

## Production and SEO

Copy `.env.example` to `.env.local` and set `SITE_URL` to your real HTTPS origin **before building**. Local/unconfigured builds deliberately disable indexing. Optionally set `GOOGLE_SITE_VERIFICATION` for Search Console.

```sh
bun run build
bun run start
bun run check:seo
```

Includes prerendered content and FAQs, canonical URL, Open Graph/Twitter metadata, generated social image, WebApplication JSON-LD, robots.txt, and sitemap.xml. Submit `/sitemap.xml` in Search Console after deployment. No analytics or image-upload endpoint is included. SEO foundations do not guarantee rankings.

## Validation

```sh
bun run lint
bun run typecheck
bun run check:seo http://localhost:3000
```

The slider supports pointer capture, touch, Arrow keys, Shift+Arrow, Home and End; both layers share exactly the same dimensions. Motion drives the hero transition and entrance animations; local Lottie data provides processing/completion feedback. Reduced-motion preferences disable animated reveals.

Cancellation discards pending results and releases object URLs. Already-running model inference completes in the background; jobs are serialized to protect the ONNX session. First-run model downloads require internet and may be large. Cache availability depends on the browser; the site is not an offline-installed PWA.

## Demo assets

`public/demo/tiger.jpg` originates from https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg. `tiger-transparent.png` is derived from that exact image by RMBG-1.4 using `scripts/create-demo.mjs`. Review source-image rights and the [BRIA RMBG-1.4 license](https://huggingface.co/briaai/RMBG-1.4) before commercial deployment. Recreating the demo asset uses the installed Node inference and Sharp dependencies and downloads model weights. The public demo animation uses the prerendered cutout and does not download the model.

Framework metadata references: [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [sitemap convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap). Transition reference: [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence).
