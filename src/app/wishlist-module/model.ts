export interface size {
  size: string;
}
export interface wishlistproduct {
  id: number;
  category: {
    title: string;
  };
  productName: string;
  productimage: string;
  description: string;
  mrp: number;
  price: number;
  ratings: number;
  ratingscount: number;
  discount: number;
  discountDisplayLabel: string;
  discountLabel: string;
  discountInpercentage: string;
  primaryColour: string;
  sizes: size[];
}
