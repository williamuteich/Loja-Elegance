// src/app/components/reels/index.tsx
import { Container } from "@/app/components/container";
import ShowInstaEmbeds from "./component/showInstaEmbeds";

interface InstagramPost {
    id: string;
    title: string;
    link: string;
    createdAt: string;
    updatedAt: string;
}

async function getInstaData() {
    try {
        const postsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/instaEmbed`, {
            cache: 'force-cache',
            next: { tags: ['embedInsta'] }
        });

        const setupRes = await fetch(`${process.env.NEXTAUTH_URL}/api/publica/setup`, {
            cache: 'force-cache',
            next: { tags: ["loadingSetup"] }
        });

        if (!postsRes.ok || !setupRes.ok) {
            throw new Error('Failed to fetch data');
        }

        const [postsData, setupData] = await Promise.all([postsRes.json(), setupRes.json()]);

        const instagramUrl = setupData.config?.find(
            (item: { type: string; name: string }) =>
                item.type === 'social' && item.name === 'instagram'
        )?.url || '';

        return {
            posts: postsData.posts || [],
            instagramUrl
        };

    } catch (error) {
        console.error('Error fetching data:', error);
        return { posts: [], instagramUrl: '' };
    }
}

export default async function Reels() {
    const { posts, instagramUrl } = await getInstaData();

    return (
        <section className="py-10 lg:pt-24 w-full bg-gray-100">
            <Container>
                <div className="w-full relative">
                    <h2 className="text-2xl relative uppercase font-extrabold text-pink-700 mb-16 text-start md:mb-6">
                        Nuestros Reels
                    </h2>

                    <ShowInstaEmbeds
                        posts={posts}
                        instagramUrl={instagramUrl}
                    />
                </div>
            </Container>
        </section>
    );
}