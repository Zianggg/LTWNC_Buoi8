import Image from "next/image";
import { SEO_ENHANCED } from "@/lib/site";

type Props = { src: string; alt: string; priority?: boolean; sizes: string; className?: string };

/** Bản "sau": next/image (resize, AVIF/WebP, giữ chỗ). Bản "trước": <img> gốc không kích thước. */
export function ProductImage({ src, alt, priority = false, sizes, className = "" }: Props) {
  if (!SEO_ENHANCED) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={priority}
      className={`object-cover ${className}`}
    />
  );
}
