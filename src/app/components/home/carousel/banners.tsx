
import { BannersClient } from './bannersClient';
import SubBannerHeader from './subBanner';

export async function Banners() {
    
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/banner`, { next: { revalidate: 3600 } });
    if (!response.ok) {
        return <p>Ocorreu um erro ao carregar os banners.</p>;
    }

    const { banners } = await response.json();

    return (
        <div>
            <div className="bg-slate-800">
                <BannersClient banners={banners} />
            </div>
            <SubBannerHeader />
        </div>
    );
}
