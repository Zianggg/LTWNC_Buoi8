import { SEO_ENHANCED } from "@/lib/site";

type JsonLdValue = string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue };

/** Nhúng structured data (schema.org); escape "<" để không chèn được </script>. */
export function JsonLd({ data }: { data: { [key: string]: JsonLdValue } }) {
  if (!SEO_ENHANCED) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
