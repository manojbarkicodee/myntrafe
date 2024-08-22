export interface filteringChips {
  value: string;
  displayValue: string;
  name: string;
}

export interface queryParams {
  brand?: string[] | string;
  price?: string[] | string;
  discount?: string[] | string;
  color?: string[] | string;
  sort?: string[] | string;
  search?:string[] | string;
}
export interface Brand {
  name: string;
}
export interface brandsSchema {
  id: number;
  name: string;
  checked?:boolean
}

export interface colorsSchema {
  primaryColour: string;
  checked?: boolean;
}
export interface Image {
  imageUrl: string;
}
export interface Category {
  title: string;
}

export interface product {
  id: number;
  Images: Image[];
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
  category: Category;
  brand: Brand;
  wishlisted?: boolean;
}

export interface sizes {
  size: string;
}

export interface productDetails {
  id: number;
  Images: Image[];
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
  category: Category;
  brand: Brand;
  sizes: sizes[];
  wishlisted?: boolean;
}

export interface similarProducts {
  id: number;
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
  category: Category;
  brand: Brand;
}
export interface PriceList {
  displayName: string;
  value: string;
  checked?:boolean
}

export interface termsAndConditions {
  header: string;
  offer: string;
  condition: string;
}
