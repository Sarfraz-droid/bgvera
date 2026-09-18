import { ImageResponse } from 'next/og'
export const alt='RMBG Studio: remove photo backgrounds on your device'
export const size={width:1200,height:630}
export const contentType='image/png'
export default function Image(){return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'center',width:'100%',height:'100%',background:'#080909',color:'#f7f7f5',padding:80,fontFamily:'sans-serif'}}><div style={{fontSize:28,marginBottom:60}}>rmbg studio</div><div style={{fontSize:80,letterSpacing:-3}}>Keep the subject.</div><div style={{fontSize:80,letterSpacing:-3,color:'#ff875f'}}>Lose the background.</div><div style={{fontSize:26,marginTop:45}}>On-device background removal. Transparent PNGs.</div></div>,size)}
