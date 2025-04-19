import { ReactNode } from "react";

export interface OrderItem {
    price: number;
    productId: string;
    product: {
      id: string;
      name: string;
      imagePrimary: string | null;
    };
    variant: {
      color: {
        name: string;
        hexCode: string;
      };
    };
    quantity: number;
  }
  
  export interface Order {
    id: string;
    userId: string;
    total: number;
    paymentMethod: string;
    paymentDetail: string | null;
    pickupLocationId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItem[];
    pickupLocation: {
      category: ReactNode;
      title: string;
      description: string;
    };
  }
  