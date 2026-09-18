import { Scissors, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { HeroWorkspace } from '@/components/hero-workspace'
import { Reveal } from '@/components/reveal'
import { description, faqs, siteName, siteUrl } from '@/lib/site'
export default function Home() {
 const structured={'@context':'https://schema.org','@type':'WebApplication',name:siteName,url:siteUrl,description,applicationCategory:'MultimediaApplication',operatingSystem:'Web browser',browserRequirements:'JavaScript and WebAssembly support',featureList:['On-device background removal','Transparent PNG export','Before and after comparison']}
 return <div className="page-shell">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\\u003c')}}/>
  <header className="site-header"><a className="wordmark" href="/" aria-label="RMBG Studio home"><Scissors size={23}/><span>rmbg<span className="wordmark-light"> studio</span></span></a><nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#questions">Questions</a></nav><span className="header-privacy"><ShieldCheck size={16}/> Made for your privacy</span></header>
  <main id="main"><HeroWorkspace/>
  <div className="tool-notes"><span><ShieldCheck size={16}/> Runs 100% on this device</span><span>No account needed</span><span>Transparent PNG export</span></div>
  <Reveal><section id="how-it-works" className="how-section"><div><h2>From photo to possibility.</h2><p>One image. A few simple steps. All on your device.</p></div><ol><li><span>1</span><div><h3>Bring your image</h3><p>Drop a product shot, portrait, or photo into the workspace.</p></div></li><li><span>2</span><div><h3>Let the background go</h3><p>The model finds your subject. Use the slider to inspect the edges.</p></div></li><li><span>3</span><div><h3>Make it your own</h3><p>Download a transparent PNG, ready for your next composition.</p></div></li></ol></section></Reveal>
  <Reveal><section id="questions" className="faq-section"><div><h2>A few things<br/>worth knowing.</h2><p>Your photos are personal.<br/>Your tools should respect that.</p></div><div className="faq-list">{faqs.map(faq=><details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section></Reveal>
  </main><footer><span>RMBG Studio · A little more room to create.</span><a href="https://huggingface.co/briaai/RMBG-1.4" target="_blank" rel="noreferrer">RMBG-1.4 model & license <ArrowUpRight size={14}/></a></footer>
 </div>
}
