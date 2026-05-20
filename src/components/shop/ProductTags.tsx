import type { ProductTag } from "@/data/shop";

const tagStyles: Record<ProductTag, string> = {
  New: "border-steel-400/40 bg-steel-400/15 text-silver-300",
  "Best Seller": "border-silver-400/45 bg-white/[0.1] text-silver-200",
  Sale: "border-red-400/35 bg-red-500/15 text-red-200",
};

type ProductTagsProps = {
  tags?: ProductTag[];
  className?: string;
};

export function ProductTags({ tags, className = "" }: ProductTagsProps) {
  if (!tags?.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagStyles[tag]}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
