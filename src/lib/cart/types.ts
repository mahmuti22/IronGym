export type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

export type AddToCartInput = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity?: number;
};

export function buildCartLineId(
  productId: string,
  size: string,
  color: string
): string {
  return `${productId}::${size}::${color}`;
}
