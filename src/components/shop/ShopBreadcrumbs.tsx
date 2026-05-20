import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ShopBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function ShopBreadcrumbs({ items }: ShopBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-silver-600">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span className="text-silver-700">/</span>}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-silver-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-silver-400" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
