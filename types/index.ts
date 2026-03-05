
export enum PaymentType {
  GOOGLE_PAY = 'GOOGLE_PAY',
  APPLE_PAY = 'APPLE_PAY',
  CREDIT_CARD = 'CREDIT_CARD',
  ALIPAY = 'ALIPAY',
  WECHAT_PAY = 'WECHAT_PAY',
  PAYPAL = 'PAYPAL'
}

export interface SavedCard {
  id: string;
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'UnionPay';
  last4: string;
  expiry: string;
  holderName: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}

export interface OrderData {
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  currency: string;
  items: OrderItem[];
}
