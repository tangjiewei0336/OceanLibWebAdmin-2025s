const images = import.meta.glob('@/assets/images/*/*/*', {eager: true})  
export const getAssetsFile = (url) => {
    const path = `/src/assets/images/${url}` // 要写绝对或者相对路径
    return images[path]?.default
    // return new URL(url, import.meta.url).href
}