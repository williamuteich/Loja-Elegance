"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAll, Product } from "@/store/productsSlice";

interface Props {
  produtos: Product[];
}

export default function ProductsStoreInit({ produtos }: Props) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (produtos && produtos.length) {
      dispatch(setAll(produtos));
    }
  }, [dispatch, produtos]);
  return null;
}
