"use client";
import { useEffect, useState } from "react";
import { BannersClient } from "./bannersClient";
import SubBannerHeader from "./subBanner";

export default function BannersClientWrapper() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await fetch('/api/publica/banner');
        if (!response.ok) throw new Error('Erro ao buscar banners');
        const data = await response.json();
        setBanners(data.banners || []);
      } catch (e: any) {
        setError(e.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  if (loading) return <p>Carregando banners...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="bg-slate-800">
        <BannersClient banners={banners} />
      </div>
      <SubBannerHeader />
    </div>
  );
}
