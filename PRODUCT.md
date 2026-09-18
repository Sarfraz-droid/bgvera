# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Bun + React (explicitly requested by user). Vite as the dev/build tool (inferred: standard pairing for Bun + React, not explicitly confirmed). Tailwind CSS + shadcn/ui, styled with a tweakcn theme (https://tweakcn.com/r/themes/cmlk6zefr000004lbe9jygsqc) per explicit user request.

## Users

[Inferred, not confirmed] A single user / small audience of people who want to remove the background from an image without uploading it to a third-party server — likely developers, designers, or privacy-conscious users experimenting with local/on-device ML.

## Product Purpose

A local-first background removal tool: the user picks/drops an image, the app runs the briaai/RMBG-1.4 segmentation model entirely in-browser via WebGPU (ONNX Runtime Web), and returns the image with its background removed (transparent PNG). No image data ever leaves the device.

## Positioning

[Inferred] Unlike hosted background-removal APIs (remove.bg, Photoroom, etc.), this tool never sends the image over the network — inference runs on-device via WebGPU, so it works offline after the model is cached and keeps images fully private.

## Operating Context

Single-page web app run locally (Bun dev server). Primary flow: select/drop an image → model loads (first run downloads/caches ~44MB ONNX weights) → inference runs client-side → result previewed with transparency → user downloads the output (PNG).

## Capabilities and Constraints

- Model: briaai/RMBG-1.4 (ONNX), run via onnxruntime-web with the WebGPU execution provider, falling back to WASM where WebGPU is unavailable.
- Model weights are fetched once from Hugging Face and cached in the browser (Cache API/IndexedDB) to avoid re-downloading.
- Processing (resize/normalize/inference/composite) happens entirely client-side; no backend/server component.
- Constrained to browsers with WebGPU or WASM SIMD support (recent Chrome/Edge/Safari).

## Product Principles

- Privacy by construction: no image data is ever transmitted off-device.
- Fast perceived performance: show clear loading/progress state for model download and inference, since first load is nontrivial.
- Trust through clarity: make the local/offline nature of the tool visible in the UI, not just true under the hood.
- Simple, single-purpose flow: upload → process → download, no unnecessary steps or accounts.
