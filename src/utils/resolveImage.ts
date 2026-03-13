export function resolveImageSrc(image: string): string {
  if (!image) {
    return "";
  }

  if (/^(https?:)?\/\//i.test(image) || image.startsWith("data:")) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/images/products/${image}`;
}

export function fallbackImageSrc(): string {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'%3E%3Crect width='800' height='1000' fill='%23ffffff'/%3E%3Ctext x='50%25' y='48%25' text-anchor='middle' fill='%235a5147' font-family='Arial, sans-serif' font-size='44'%3EK Shop%3C/text%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' fill='%23847667' font-family='Arial, sans-serif' font-size='24'%3EFashion Image Placeholder%3C/text%3E%3C/svg%3E";
}

export function applyImageFallback(event: { currentTarget: HTMLImageElement }) {
  const element = event.currentTarget;
  element.src = fallbackImageSrc();
}
