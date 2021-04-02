export function downloadBase64File(base64Data, filename) {
    var element = document.createElement('a');
    element.setAttribute('href', base64Data);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

export function base64StringtoFile(base64String, filename) {
    var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export function extractImageFileExtensionFromBase64(base64Data){
    return base64Data.substring("data:image/".length, base64Data.indexOf(";base64"))
}

export function image64toCanvasRef(image, crop) {

    const canvas = document.createElement("canvas");;
    canvas.setAttribute("style", "display: block")
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    canvas.style.width = `${crop.width }px`
    canvas.style.height = `${crop.height}px`

    const ctx = canvas.getContext('2d');
    

    
    //VW gets viewport width
    //factor takes into account the gap between the modal edge and the photo start
    //without factor, the canvas would be taken from the image *factor* amount of pixels to the right

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

    let factor = 0

    if(vw>=600){
      factor = (vw*.8 - image.width)/2
    }

    ctx.drawImage(
      image,
      (crop.x - factor) * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas

    
  }
