const KB = 1024;
const MB = 1024**2

export const convertBytesToString = (bytes:number):string => {
  const size_KB = bytes / KB;
  const size_MB = bytes / MB;

  if(size_MB > 1 ) return Math.ceil(size_MB * 1000) / 1000 +"MB";
  return Math.ceil(size_KB * 1000) / 1000 +"KB";
}