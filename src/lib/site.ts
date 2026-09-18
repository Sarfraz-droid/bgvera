export const siteName = 'bgvera'
export const description = 'Remove image backgrounds in your browser. Keep your photos on your device, compare the result, and download a transparent PNG.'
const configured = process.env.SITE_URL
export const siteUrl = new URL(configured || 'http://localhost:3000').origin
export const isPublicSite = Boolean(configured && !['localhost','127.0.0.1'].includes(new URL(configured).hostname))
export const faqs = [
 {question:'How do I remove the background from an image?',answer:'Choose a JPG, PNG, or WebP image, or drop it into the workspace. The model separates the subject from its background on your device. Compare the result, then download your transparent PNG.'},
 {question:'Are my photos uploaded to a server?',answer:'No. Image processing happens in your browser. Your browser downloads the AI model from Hugging Face, but your selected photos are not sent to a server.'},
 {question:'Why does the first image take longer?',answer:'The first run downloads and prepares the RMBG-1.4 model. Your browser can cache these files for later use. Processing speed depends on your device, browser, and image size.'},
 {question:'What image formats can I use?',answer:'Choose a JPG, PNG, or WebP file up to 20 MB. Results are exported as a transparent PNG at the original image dimensions. Clear subjects with distinct edges generally work best.'},
 {question:'Can I use the results commercially?',answer:'This tool uses BRIA’s RMBG-1.4 model, which has its own license and commercial-use terms. Review the model license and your rights to the source image before using results commercially.'},
]
