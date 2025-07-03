
import { BannersClient } from './bannersClient';
import SubBannerHeader from './subBanner';

export async function Banners() {
    
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/banner`, { next: { revalidate: 8000 } });
    if (!response.ok) {
        return <p>Ocorreu um erro ao carregar os banners.</p>;
    }

    const { banners } = await response.json();

    return (
        <div>
            <div className="bg-[#b11a48]">
                <BannersClient banners={banners} />
            </div>
            <SubBannerHeader />
        </div>
    );
}
