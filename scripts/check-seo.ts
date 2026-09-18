/** Run against a production build: bun run check:seo [http://localhost:3000] */
const base = process.argv[2] || 'http://localhost:3000'
const response = await fetch(base)
const html = await response.text()
const checks: [string, boolean][] = [
 ['Homepage returns 200',response.status===200],
 ['Page title',/<title>[^<]+<\/title>/.test(html)],
 ['Meta description',/<meta name="description" content="[^"]+"/.test(html)],
 ['Canonical URL',/<link rel="canonical" href="https?:\/\//.test(html)],
 ['Social preview',html.includes('property="og:image"') && html.includes('name="twitter:card"')],
 ['One primary heading',(html.match(/<h1[\s>]/g)||[]).length===1],
 ['Server-rendered help',html.includes('Are my photos uploaded to a server?')],
 ['Structured data',html.includes('application/ld+json') && html.includes('WebApplication')],
 ['Document language',html.includes('<html lang="en"')],
]
for (const path of ['/robots.txt','/sitemap.xml','/opengraph-image']) {
 const res=await fetch(new URL(path,base));checks.push([path,res.ok])
}
for(const [name,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${name}`)
if(html.includes('noindex')) console.warn('Indexing disabled: set SITE_URL to the public production origin before building.')
if(checks.some(([,ok])=>!ok))process.exitCode=1
export {}
