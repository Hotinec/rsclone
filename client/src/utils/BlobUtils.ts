export class BlobUtils {
  static base64ToURL(base64: string): string {
    const blob = this.base64ToBlob(base64);
    return URL.createObjectURL(blob);
  }

  static base64ToBlob(base64: string): Blob {
    const arr = base64.split(',');
    // @ts-ignore: Object is possibly 'null'.
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length; const
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
}
