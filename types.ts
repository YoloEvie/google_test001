
// Fix: Added React import to resolve missing namespace for ReactNode in TypeScript
import React from 'react';

export enum PaymentType {
  GOOGLE_PAY = 'GOOGLE_PAY',
  APPLE_PAY = 'APPLE_PAY',
  CREDIT_CARD = 'CREDIT_CARD'
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
  totalAmount: number; // Original total
  discountAmount: number; // Discount to subtract
  currency: string;
  items: OrderItem[];
}

// Fixed: Use any for type and onSelect to allow for extended payment enums in the demo
export interface PaymentOptionProps {
  type: any;
  isSelected: boolean;
  onSelect: (type: any) => void;
  label: string;
  icon: React.ReactNode;
}
