export interface Produto {
    id: string;
    name: string;
    description: string;
    price: number;
    priceOld?: number;
    active: boolean;
    onSale: boolean;
    brandId: string;
    imagePrimary: string;
    imagesSecondary: string[];
    features: string | null;
    brand: {
      id: string;
      name: string;
      description: string | null;
      active: boolean;
      createdAt: string;
      updatedAt: string;
    };
    categories: {
      id: string;
      name: string;
      description: string | null;
      active: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
    stock?: {
      id: string;
      size: string;
      quantity: number;
      active: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProdutoProps {
    produtos: Produto[];
  }
  