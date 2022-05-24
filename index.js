var Jimp = require('jimp');
async function textWaterMark (text,options) {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
    let textHeight = Jimp.measureTextHeight(font, text);
    let textWidth = Jimp.measureText(font, text)
    const image = await new Jimp(textWidth, textHeight, '#FFFFFF00');
    image.print(font, 0, 0, {
            text
        },
        400,
        50)
    image.opacity(options.opacity);
    image.scale(3)
    image.rotate( options.rotation )
    image.scale(0.3)
    image.resize(options.textSize,Jimp.AUTO)
    return image
}
async function calculatePositionList (mainImage, watermarkImg){
    const width = mainImage.getWidth()
    const height = mainImage.getHeight()
    const stepWidth = watermarkImg.getWidth()
    const stepHeight = watermarkImg.getHeight()
    let ret = []
    for(let i=0; i < width; i=i+stepWidth) {
        for (let j = 0; j < height; j=j+stepHeight) {
            ret.push([i, j])
        }
    }
    return ret
}
const waterMark = async (imageSrc,options)=>{
    const image = await Jimp.read(imageSrc)
    const waterMark = await textWaterMark(options.text,options)
    const positionList = await calculatePositionList(image,waterMark)
    for (let i =0; i < positionList.length; i++) {
        const coords = positionList[i]
        image.composite(waterMark,
            coords[0], coords[1] );
    }
    image.quality(100).write("water.jpg");
}

waterMark('public/test.JPG',{
    textSize: 500,
    opacity: 0.5,
    rotation: 45,
    text: 'watermark test',
})
