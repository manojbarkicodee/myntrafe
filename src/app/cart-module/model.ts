export interface cartProducts {
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
  productDetails: ProductDetails;
  brand: {
    name: string;
  };
  sizes: size[];
  deliveyDate?: string;
}
export interface size {
  size: string;
}

export interface ProductDetails {
  quantity: number;
  size: string;
}

export interface alertDynamicData {
  header: string;
  description: string;
  imageurl?: string;
  btntext: string;
  deleteid: number | string;
  wishlidids: number | { productId: number }[];
  single: boolean;
  mobileView:boolean;
}

export interface selectedProducts {
  productId: number;
  mrp: number;
  price: number;
  discount: number;
  size: string;
  quantity: number;
  deliveryDate: string | undefined;
  productImage: string;
}

export interface pricingDetails {
  totalMrp: number;
  discountOnMrp: number;
  totalAmount: number;
  couponDiscount?: number;
  estimatedDeliveryDate: string;
  selectedProducts?: selectedProducts[];
}

export interface couponsList {
  couponCode: string;
  saving: string;
  minimumPurchaseDescription: string;
  minimumPurchaseAmount: number;
  checked: boolean;
}

export interface address {
  id: number;
  name: string;
  phoneNumber: string|number;
  pincode: string|number;
  address: string;
  locality: string;
  district: string;
  state: string;
  belongsTo: string;
  default?: boolean;
  deleted?:boolean;
}
export interface addressData {
  name: string;
  phoneNumber: string|number;
  pincode: string|number;
  address: string;
  locality: string;
  district: string;
  state: string;
  belongsTo: string;
  default?: boolean;
  deleted?:boolean;
}
export interface editAddress {
  defaultValues: address;
  editMode: boolean;
  mobileView:boolean;
}

export interface card {
  cardnumber: string;
  name: string;
  date: string;
  cvv: string;
}

export interface outputCardData {
  cardnumber: string;
  name: string;
  expirydate: string;
  cvvnumber: string;
}

export interface cardresponse{
  id:number
  cardnumber: string;
  name: string;
  expirydate: string;
  cvvnumber: string;
}
export interface successResponse {
  statusCode: number;
  message: string;
  status: string;
  orderId?:any;
}

export interface orderedProducts {
  productId: number;
  size: string;
  quantity: number;
}

export interface orderPayload {
  deliveryAddressId: number;
  totalPrice: number;
  discountedPrice: number;
  paymentMethod: string;
  estimatedDeliveryDate: string;
  products: orderedProducts[] | undefined;
}
