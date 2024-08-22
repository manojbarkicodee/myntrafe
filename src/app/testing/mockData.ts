import { address, cardresponse, cartProducts } from '../cart-module/model';
import { filteringChips } from '../productsModule/model';
import { orderDetails } from '../profile-module/model';
export let products = [
  {
    id: 1084,
    productName: 'HERE&NOW Men Black Slim Fit Floral Printed Casual Shirt',
    productimage:
      'http://assets.myntassets.com/assets/images/18060960/2022/4/27/336b618a-9148-436c-b140-42dbaa83caae1651071332386HERENOWMenBlackSlimFitPrintedCasualShirt1.jpg',
    description: 'Slim Fit Floral Casual Shirt',
    mrp: 1999,
    price: 699,
    ratings: 4.31013,
    ratingscount: 158,
    discount: 1300,
    discountDisplayLabel: '(Rs. 1300 OFF)',
    discountLabel: 'Flat_Search_Amount',
    discountInpercentage: 'Rs.',
    primaryColour: 'Black',
    category: {
      title: 'mens',
    },
    brand: {
      name: 'HERE&NOW',
    },
    Images: [
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/18060960/2022/4/27/75fb4685-a8b8-4ffa-bea5-6b2295034abd1651071332434HERENOWMenBlackSlimFitPrintedCasualShirt6.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/18060960/2022/4/27/336b618a-9148-436c-b140-42dbaa83caae1651071332386HERENOWMenBlackSlimFitPrintedCasualShirt1.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/18060960/2022/4/27/e667649e-f565-424c-982a-ca75aa3098e91651071332482HERENOWMenBlackSlimFitPrintedCasualShirt4.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/18060960/2022/4/27/336b618a-9148-436c-b140-42dbaa83caae1651071332386HERENOWMenBlackSlimFitPrintedCasualShirt1.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/18060960/2022/4/27/d9ca1c19-67c3-47ce-86f1-3d686aa683471651071332452HERENOWMenBlackSlimFitPrintedCasualShirt7.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/18060960/2022/4/27/23d1a281-50a8-4d04-8a9d-f7c21c3d5cb81651071332414HERENOWMenBlackSlimFitPrintedCasualShirt5.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/18060960/2022/4/27/aec0c0b4-067b-420e-826a-ab21e78273181651071332395HERENOWMenBlackSlimFitPrintedCasualShirt2.jpg',
      },
      {
        imageUrl: '',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/18060960/2022/4/27/32491277-f0ca-4fff-8eae-9622b39bd3201651071332473HERENOWMenBlackSlimFitPrintedCasualShirt3.jpg',
      },
    ],
  },
  {
    id: 1072,
    productName: 'Moda Rapido Men Blue & White Slim Fit Striped Casual Shirt',
    productimage:
      'http://assets.myntassets.com/assets/images/11262530/2020/1/9/729b1a8d-ea74-4f8a-94dd-67bdae8138911578570881117-Moda-Rapido-Men-Shirts-7151578570877582-1.jpg',
    description: 'Men Slim Fit Casual Shirt',
    mrp: 2099,
    price: 799,
    ratings: 4.29791,
    ratingscount: 1722,
    discount: 1300,
    discountDisplayLabel: '(Rs. 1300 OFF)',
    discountLabel: 'Flat_Search_Amount',
    discountInpercentage: 'Rs.',
    primaryColour: 'Blue',
    category: {
      title: 'mens',
    },
    brand: {
      name: 'Moda Rapido',
    },
    Images: [
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/11262530/2020/1/9/e593fe89-032d-47c8-90e8-879867666a621578570880906-Moda-Rapido-Men-Shirts-7151578570877582-5.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/11262530/2020/1/9/729b1a8d-ea74-4f8a-94dd-67bdae8138911578570881117-Moda-Rapido-Men-Shirts-7151578570877582-1.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/11262530/2020/1/9/ebaaf772-ca94-4032-8ada-ab02a9c56c081578570880850-Moda-Rapido-Men-Shirts-7151578570877582-6.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/11262530/2020/1/9/0c40ece4-08e1-4033-9234-9358e3bf4ab11578570880960-Moda-Rapido-Men-Shirts-7151578570877582-4.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/11262530/2020/1/9/aab6f04e-a215-4fda-ad02-9008c590aa591578570881067-Moda-Rapido-Men-Shirts-7151578570877582-2.jpg',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/11262530/2020/1/9/119e1f60-1342-4577-97c6-5bdfeb168e611578570881021-Moda-Rapido-Men-Shirts-7151578570877582-3.jpg',
      },
      {
        imageUrl: '',
      },
      {
        imageUrl:
          'http://assets.myntassets.com/assets/images/11262530/2020/1/9/729b1a8d-ea74-4f8a-94dd-67bdae8138911578570881117-Moda-Rapido-Men-Shirts-7151578570877582-1.jpg',
      },
    ],
  },
];
export let cartProductsData: cartProducts[] = [
  {
    id: 1052,
    productName:
      'The Indian Garage Co Men White & Teal Blue Slim Fit Striped Casual Shirt',
    productimage:
      'http://assets.myntassets.com/assets/images/10673544/2019/9/24/6b9c7688-7ca2-4d11-9e5b-a3745ecd8f761569310358973-The-Indian-Garage-Co-Men-Shirts-8481569310357131-1.jpg',
    description: 'Men Slim Fit Casual Shirt',
    mrp: 1649,
    price: 626,
    ratings: 4.07459,
    ratingscount: 7722,
    discount: 1023,
    discountDisplayLabel: '(62% OFF)',
    discountLabel: 'Flat_Search_Percent',
    discountInpercentage: '62',
    primaryColour: 'White',
    brand: {
      name: 'The Indian Garage Co',
    },
    sizes: [
      {
        size: 'S',
      },
      {
        size: 'M',
      },
      {
        size: 'L',
      },
      {
        size: 'XL',
      },
      {
        size: 'XXL',
      },
    ],
    productDetails: {
      quantity: 1,
      size: 'L',
    },
  },
  {
    id: 1099,
    productName:
      'Roadster Men Blue Slim Fit Faded Casual Denim Sustainable Shirt',
    productimage:
      'http://assets.myntassets.com/assets/images/2284633/2018/2/19/11519031607868-Roadster-Men-Shirts-5971519031607655-1.jpg',
    description: 'Men Slim Fit Casual Shirt',
    mrp: 1799,
    price: 719,
    ratings: 4.09136,
    ratingscount: 2211,
    discount: 1080,
    discountDisplayLabel: '(60% OFF)',
    discountLabel: 'Flat_Search_Percent',
    discountInpercentage: '60',
    primaryColour: 'Blue',
    brand: {
      name: 'Roadster',
    },
    sizes: [
      {
        size: 'S',
      },
      {
        size: 'M',
      },
      {
        size: 'L',
      },
      {
        size: 'XL',
      },
      {
        size: 'XXL',
      },
    ],
    productDetails: {
      quantity: 1,
      size: 'L',
    },
  },
  {
    id: 1127,
    productName:
      'Vishudh Women Mustard Yellow & Teal Blue Printed Layered A-Line Kurta',
    productimage:
      'http://assets.myntassets.com/assets/images/11862404/2021/3/3/ded302b3-07f1-4054-8299-3b832e5dcded1614767056621-Vishudh-Women-Mustard-Yellow--Teal-Blue-Printed-Layered-A-Li-1.jpg',
    description: 'Layered A-Line Kurta',
    mrp: 3899,
    price: 623,
    ratings: 4.29412,
    ratingscount: 51,
    discount: 3276,
    discountDisplayLabel: '(84% OFF)',
    discountLabel: 'Flat_Search_Percent',
    discountInpercentage: '84',
    primaryColour: 'Mustard',
    brand: {
      name: 'Vishudh',
    },
    sizes: [
      {
        size: 'S',
      },
      {
        size: 'M',
      },
      {
        size: 'L',
      },
      {
        size: 'XL',
      },
      {
        size: 'XXL',
      },
    ],
    productDetails: {
      quantity: 1,
      size: 'L',
    },
  },
];

export let brandsOnsearch = [
  {
    id: 1,
    name: 'Roadstar',
    checked: false,
  },
  {
    id: 2,
    name: 'cargo',
    checked: false,
  },
];

export let profileDetails = {
  alternateMobileNumber: '45768689645',
  birthDate: '29/08/1998',
  email: 'test@gmail.com',
  fullName: 'test',
  gender: 'male',
  id: 1,
  location: 'bengaluru',
  mobileNumber: '6748364589',
};
export let product = {
  id: 1105,
  productName:
    'The Indian Garage Co Men White & Teal Blue Slim Fit Striped Casual Shirt',
  productimage:
    'http://assets.myntassets.com/assets/images/10673544/2019/9/24/6b9c7688-7ca2-4d11-9e5b-a3745ecd8f761569310358973-The-Indian-Garage-Co-Men-Shirts-8481569310357131-1.jpg',
  description: 'Men Slim Fit Casual Shirt',
  mrp: 1649,
  price: 626,
  ratings: 4.07459,
  ratingscount: 7722,
  discount: 1023,
  discountDisplayLabel: '(62% OFF)',
  discountLabel: 'Flat_Search_Percent',
  discountInpercentage: '62',
  primaryColour: 'White',
  category: {
    title: 'mens',
  },
  brand: {
    name: 'The Indian Garage Co',
  },
  Images: [
    {
      imageUrl:
        'http://assets.myntassets.com/assets/images/10673544/2019/9/24/6b9c7688-7ca2-4d11-9e5b-a3745ecd8f761569310358973-The-Indian-Garage-Co-Men-Shirts-8481569310357131-1.jpg',
    },
    {
      imageUrl:
        'http://assets.myntassets.com/assets/images/10673544/2019/9/24/729859d8-cc66-4465-ba81-27028b9d7a461569310358945-The-Indian-Garage-Co-Men-Shirts-8481569310357131-2.jpg',
    },
    {
      imageUrl:
        'http://assets.myntassets.com/assets/images/10673544/2019/9/24/0c876b8b-6633-4577-aa3f-89a64d0651e81569310358890-The-Indian-Garage-Co-Men-Shirts-8481569310357131-4.jpg',
    },
    {
      imageUrl:
        'http://assets.myntassets.com/assets/images/10673544/2019/9/24/6b9c7688-7ca2-4d11-9e5b-a3745ecd8f761569310358973-The-Indian-Garage-Co-Men-Shirts-8481569310357131-1.jpg',
    },
    {
      imageUrl:
        'http://assets.myntassets.com/assets/images/10673544/2019/9/24/ec7dcc09-7640-4f17-a49d-69ccce54753c1569310358858-The-Indian-Garage-Co-Men-Shirts-8481569310357131-5.jpg',
    },
    {
      imageUrl: '',
    },
    {
      imageUrl:
        'http://assets.myntassets.com/assets/images/10673544/2019/9/24/66eb9c68-a2d9-41b1-8016-cf769e78d3a11569310358918-The-Indian-Garage-Co-Men-Shirts-8481569310357131-3.jpg',
    },
  ],
  sizes: [
    {
      size: 'S',
    },
    {
      size: 'M',
    },
    {
      size: 'L',
    },
    {
      size: 'XL',
    },
    {
      size: 'XXL',
    },
  ],
};
export let similarProducts = [
  {
    id: 1051,
    productName: 'Roadster Men Black & Grey Checked Pure Cotton Casual Shirt',
    productimage:
      'http://assets.myntassets.com/assets/images/1376577/2022/6/3/ea10ab6c-883e-437a-8780-ed87484393f81654235830793-Roadster-Men-Black--Grey-Checked-Casual-Sustainable-Shirt-42-1.jpg',
    description: 'Men Pure Cotton Casual Shirt',
    mrp: 1499,
    price: 524,
    ratings: 4.26236,
    ratingscount: 32780,
    discount: 975,
    discountDisplayLabel: '(65% OFF)',
    discountLabel: 'Flat_Search_Percent',
    discountInpercentage: '65',
    primaryColour: 'Black',
    category: {
      title: 'mens',
    },
    brand: {
      name: 'Roadster',
    },
  },
  {
    id: 1052,
    productName:
      'The Indian Garage Co Men White & Teal Blue Slim Fit Striped Casual Shirt',
    productimage:
      'http://assets.myntassets.com/assets/images/10673544/2019/9/24/6b9c7688-7ca2-4d11-9e5b-a3745ecd8f761569310358973-The-Indian-Garage-Co-Men-Shirts-8481569310357131-1.jpg',
    description: 'Men Slim Fit Casual Shirt',
    mrp: 1649,
    price: 626,
    ratings: 4.07459,
    ratingscount: 7722,
    discount: 1023,
    discountDisplayLabel: '(62% OFF)',
    discountLabel: 'Flat_Search_Percent',
    discountInpercentage: '62',
    primaryColour: 'White',
    category: {
      title: 'mens',
    },
    brand: {
      name: 'The Indian Garage Co',
    },
  },
  {
    id: 1053,
    productName: 'Campus Sutra Men White & Blue Striped Casual Shirt',
    productimage:
      'http://assets.myntassets.com/assets/images/14811424/2021/7/26/d5ffc4e7-f447-4df1-b417-9ac68372cd6e1627300540761-Campus-Sutra-Men-Shirts-6941627300540022-1.jpg',
    description: 'Striped Casual Shirt',
    mrp: 1499,
    price: 749,
    ratings: 4.3007,
    ratingscount: 1716,
    discount: 750,
    discountDisplayLabel: '(50% OFF)',
    discountLabel: 'Flat_Search_Percent',
    discountInpercentage: '50',
    primaryColour: 'White',
    category: {
      title: 'mens',
    },
    brand: {
      name: 'Campus Sutra',
    },
  },
];

export let wishlistProducts = [
  {
    id: 1102,
    productName:
      'Libas Women Blue & Pink Ethnic Motifs Printed Gotta Patti Kurta',
    productimage:
      'http://assets.myntassets.com/assets/images/17644452/2022/4/6/ef668fbb-c88a-4243-b9bd-3282d2a84afd1649238881413-Libas-Women-Kurtas-5701649238880836-1.jpg',
    description: 'Women Ethnic Motifs Printed Kurta',
    mrp: 1499,
    price: 524,
    ratings: 4.28252,
    ratingscount: 761,
    discount: 975,
    discountDisplayLabel: '(65% OFF)',
    discountLabel: 'Flat_Search_Percent',
    discountInpercentage: '65',
    primaryColour: 'Blue',
    category: {
      title: 'womens',
    },
    sizes: [
      {
        size: 'S',
      },
      {
        size: 'M',
      },
      {
        size: 'L',
      },
      {
        size: 'XL',
      },
      {
        size: 'XXL',
      },
    ],
  },
  {
    id: 1105,
    productName:
      'Varanga Women Peach-Coloured & White Bandhani Printed Pure Cotton Kurta',
    productimage:
      'http://assets.myntassets.com/assets/images/13764318/2021/4/7/c6a16eb7-833d-4df2-8e0e-cb694a8a83e51617792817180-Varanga-Peach-Bandhani-Printed-Embroidered-Kurta-69516177928-1.jpg',
    description: 'Women Printed Cotton Kurta',
    mrp: 2799,
    price: 719,
    ratings: 4.26074,
    ratingscount: 5887,
    discount: 2080,
    discountDisplayLabel: '(Rs. 2080 OFF)',
    discountLabel: 'Flat_Search_Amount',
    discountInpercentage: 'Rs.',
    primaryColour: 'Peach',
    category: {
      title: 'womens',
    },
    sizes: [
      {
        size: 'S',
      },
      {
        size: 'M',
      },
      {
        size: 'L',
      },
      {
        size: 'XL',
      },
      {
        size: 'XXL',
      },
    ],
  },
];

export let queryParamsOnfilterData = {
  sort: 'price:asc',
  search: 'example search',
  brand: ['Roadster', 'The Indian Garage Co'],
  price: ['10:20', '30:40'],
  discount: ['5:10', '15:20'],
};

export const valueToRemove: filteringChips = {
  value: 'Roadster',
  displayValue: 'Roadster',
  name: 'brand',
};

export const colors = [
  {
    primaryColour: 'Black',
  },
  {
    primaryColour: 'Blue',
  },
  {
    primaryColour: 'Navy Blue',
  },
  {
    primaryColour: 'Maroon',
  },
  {
    primaryColour: 'Camel Brown',
  },
];

export const addresses: address[] = [
  {
    id: 9,
    name: 'manoj',
    phoneNumber: 6361377450,
    pincode: 581110,
    address: 'testghj',
    locality: 'haveri',
    district: 'hvcaeri',
    state: 'karntaka',
    belongsTo: 'home',
    default: false,
    deleted: true,
  },
  {
    id: 10,
    name: 'manoj',
    phoneNumber: 6361377450,
    pincode: 581110,
    address: 'hanchinamani strret',
    locality: 'haveri',
    district: 'havri',
    state: 'karnataka',
    belongsTo: 'home',
    default: true,
    deleted: false,
  },
];

export let cards: cardresponse[] = [
  {
    id: 5,
    cardnumber: '4563135788990009',
    name: 'test123',
    expirydate: '2028-09-28',
    cvvnumber: '678',
  },
];

export let orderredDetails: orderDetails[] = [
  {
    id: 1,
    totalPrice: 1878,
    discountedPrice: 3069,
    paymentMethod: 'cash on delivery',
    estimatedDeliveryDate: '2023-06-30',
    createdAt: '2023-10-05T13:03:12.000Z',
    address: {
      name: 'Manoj barki',
      phoneNumber: 6361377450,
      pincode: 581110,
      address: 'hanchinamani street ',
      locality: 'agadi',
      district: 'haveri',
      state: 'karnataka',
      belongsTo: 'home',
      default: false,
      deleted: true,
    },
    products: [
      {
        id: 1052,
        productName:
          'The Indian Garage Co Men White & Teal Blue Slim Fit Striped Casual Shirt',
        productimage:
          'http://assets.myntassets.com/assets/images/10673544/2019/9/24/6b9c7688-7ca2-4d11-9e5b-a3745ecd8f761569310358973-The-Indian-Garage-Co-Men-Shirts-8481569310357131-1.jpg',
        description: 'Men Slim Fit Casual Shirt',
        mrp: 1649,
        price: 626,
        ratings: 4.07459,
        ratingscount: 7722,
        discount: 1023,
        discountDisplayLabel: '(62% OFF)',
        discountLabel: 'Flat_Search_Percent',
        discountInpercentage: '62',
        primaryColour: 'White',
        category: {
          title: 'mens',
        },
        ordersItems: {
          quantity: 3,
          size: 'L',
          cancel: true,
        },
      },
      {
        id: 1102,
        productName:
          'Libas Women Blue & Pink Ethnic Motifs Printed Gotta Patti Kurta',
        productimage:
          'http://assets.myntassets.com/assets/images/17644452/2022/4/6/ef668fbb-c88a-4243-b9bd-3282d2a84afd1649238881413-Libas-Women-Kurtas-5701649238880836-1.jpg',
        description: 'Women Ethnic Motifs Printed Kurta',
        mrp: 1499,
        price: 524,
        ratings: 4.28252,
        ratingscount: 761,
        discount: 975,
        discountDisplayLabel: '(65% OFF)',
        discountLabel: 'Flat_Search_Percent',
        discountInpercentage: '65',
        primaryColour: 'Blue',
        category: {
          title: 'womens',
        },
        ordersItems: {
          quantity: 1,
          size: 'L',
          cancel: false,
        },
      },
    ],
  },
  {
    id: 2,
    totalPrice: 524,
    discountedPrice: 975,
    paymentMethod: 'debitcard',
    estimatedDeliveryDate: '2023-06-30',
    createdAt: '2023-10-06T10:09:05.000Z',
    address: {
      name: 'manoj',
      phoneNumber: 6361377450,
      pincode: 581110,
      address: 'fghhh',
      locality: 'haveri',
      district: 'haveri',
      state: 'karnataka',
      belongsTo: 'home',
      default: false,
      deleted: true,
    },
    products: [
      {
        id: 1102,
        productName:
          'Libas Women Blue & Pink Ethnic Motifs Printed Gotta Patti Kurta',
        productimage:
          'http://assets.myntassets.com/assets/images/17644452/2022/4/6/ef668fbb-c88a-4243-b9bd-3282d2a84afd1649238881413-Libas-Women-Kurtas-5701649238880836-1.jpg',
        description: 'Women Ethnic Motifs Printed Kurta',
        mrp: 1499,
        price: 524,
        ratings: 4.28252,
        ratingscount: 761,
        discount: 975,
        discountDisplayLabel: '(65% OFF)',
        discountLabel: 'Flat_Search_Percent',
        discountInpercentage: '65',
        primaryColour: 'Blue',
        category: {
          title: 'womens',
        },
        ordersItems: {
          quantity: 1,
          size: 'L',
          cancel: false,
        },
      },
    ],
  },
];


export let pricingDetails={
  "totalMrp": 5698,
  "discountOnMrp": 4356,
  "totalAmount": 1342,
  "estimatedDeliveryDate": "15 Jan 2024",
  "selectedProducts": [
      {
          "productId": 1099,
          "mrp": 1799,
          "price": 719,
          "discount": 1080,
          "size": "L",
          "quantity": 1,
          "deliveryDate": "15 Jan 2024",
          "productImage": "http://assets.myntassets.com/assets/images/2284633/2018/2/19/11519031607868-Roadster-Men-Shirts-5971519031607655-1.jpg"
      },
      {
          "productId": 1127,
          "mrp": 3899,
          "price": 623,
          "discount": 3276,
          "size": "L",
          "quantity": 1,
          "deliveryDate": "15 Jan 2024",
          "productImage": "http://assets.myntassets.com/assets/images/11862404/2021/3/3/ded302b3-07f1-4054-8299-3b832e5dcded1614767056621-Vishudh-Women-Mustard-Yellow--Teal-Blue-Printed-Layered-A-Li-1.jpg"
      }
  ]
}