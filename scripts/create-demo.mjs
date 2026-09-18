import { AutoModel, AutoProcessor, RawImage, env } from '@huggingface/transformers'
import sharp from 'sharp'
env.allowLocalModels = false
const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {config:{model_type:'custom'},dtype:'fp32',device:'cpu'})
const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {config:{do_normalize:true,do_pad:false,do_rescale:true,do_resize:true,image_mean:[.5,.5,.5],feature_extractor_type:'ImageFeatureExtractor',image_std:[1,1,1],resample:2,rescale_factor:1/255,size:{width:1024,height:1024}}})
const image=await RawImage.read('public/demo/tiger.jpg')
const {pixel_values}=await processor(image)
const {output}=await model({input:pixel_values})
const mask=await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width,image.height)
await sharp('public/demo/tiger.jpg').joinChannel(Buffer.from(mask.data),{raw:{width:image.width,height:image.height,channels:1}}).png().toFile('public/demo/tiger-transparent.png')
console.log('Created real model cutout',image.width,image.height)
await model.dispose()
