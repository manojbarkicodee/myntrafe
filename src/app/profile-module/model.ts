export interface dashboardElementsSchema {
  imageUrl: string;
  title: string;
  description: string;
}

export interface orderDetails {
  id: number;
  totalPrice: number;
  discountedPrice: number;
  paymentMethod: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  address: Address;
  products: Product[];
 
}

export interface Address {
  name: string;
  phoneNumber: number;
  pincode: number;
  address: string;
  locality: string;
  district: string;
  state: string;
  belongsTo: string;
  default: boolean;
  deleted?:boolean;
}

export interface Product {
  id: number;
  orderId?: number;
  orderCreatedAt?: string;
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
  deliveryDate?: string;
  category: {
    title: string;
  };
  orderStatus?: {
    status: string;
    description: string;
    validToDeleteOrder: boolean;
  };

  ordersItems: OrdersItems;
}

export interface OrdersItems {
  quantity: number;
  size: string;
  cancel?: boolean;
}

export interface profileDetails {
  alternateMobileNumber:string|undefined|number;
  birthDate:string|undefined;
  email: string|undefined;
  fullName: string|undefined;
  gender:string|undefined;
  id: number;
  location:string|undefined;
  mobileNumber:string|undefined|number;
}
