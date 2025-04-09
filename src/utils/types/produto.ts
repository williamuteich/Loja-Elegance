export interface Produto {
    variants: any;
    category: any;
    id: string;
    name: string;
    description: string;
    price: number;
    priceOld?: number;
    active: boolean;
    onSale: boolean;
    destaque: boolean;
    brandId: string;
    imagePrimary: string;
    imagesSecondary: string[];
    features: string | null;
    categories: ProductCategoryProps[];
    availableStock?: number;
    brand: BrandProps;
    stock: StockProps;
    createdAt: string;
    updatedAt: string;
    variant: string;
    idx: string
  }

  export interface ProdutoProps {
    produtos: Produto[];
  }
  
  interface ProductCategoryProps {
    id: string;
    productId: string;
    categoryId: string;
    category: CategoryProps;
}

interface CategoryProps {
    id: string;
    name: string;
}

interface BrandProps {
    id: string;
    name: string;
}

interface StockProps {
    id: string;
    quantity: number;
}
  
export interface VariantProps {
  id: string;
  color: {
      name: string;
      hexCode: string;
  };
  availableStock: number;
  stock: StockProps;
}
