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
    categories: ProductCategoryProps[];
    brand: BrandProps;
    stock: StockProps;
    createdAt: string;
    updatedAt: string;
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
  