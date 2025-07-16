import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  [key: string]: any;
}

const initialState: Product[] = [];

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setAll: (_state, action: PayloadAction<Product[]>) => action.payload,
  },
});

export const { setAll } = productsSlice.actions;
export default productsSlice.reducer;
