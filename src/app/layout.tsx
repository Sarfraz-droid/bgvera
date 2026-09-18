import type { Metadata, Viewport } from 'next'
import { description, isPublicSite, siteName, siteUrl } from '@/lib/site'
import '@/index.css'
export const metadata: Metadata = {
 metadataBase:new URL(siteUrl), title:{default:'Remove Image Backgrounds Privately | RMBG Studio',template:`%s | ${siteName}`},description,
 alternates:{canonical:'/'}, applicationName:siteName,
 robots:{index:isPublicSite,follow:isPublicSite},
 openGraph:{type:'website',locale:'en_US',url:'/',siteName,title:'Keep the subject. Lose the background.',description,images:[{url:'/opengraph-image',width:1200,height:630,alt:'RMBG Studio: private background removal'}]},
 twitter:{card:'summary_large_image',title:'RMBG Studio | Private Background Remover',description,images:['/opengraph-image']},
 icons:{icon:'/favicon.svg'}, verification:{google:process.env.GOOGLE_SITE_VERIFICATION},
}
export const viewport:Viewport={themeColor:'#080909'}
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a>{children}</body></html>}
