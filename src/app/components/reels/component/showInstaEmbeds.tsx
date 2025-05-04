'use client';

import { useEffect, useRef } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Script from 'next/script';
import Link from 'next/link';

declare global {
    interface Window {
        instgrm?: {
            Embeds: {
                process: () => void;
            };
        };
    }
}

interface InstagramPost {
    id: string;
    title: string;
    link: string;
    createdAt: string;
    updatedAt: string;
}

interface ShowInstaEmbedsProps {
    posts: InstagramPost[];
    instagramUrl: string;
}

export default function ShowInstaEmbeds({ posts, instagramUrl }: ShowInstaEmbedsProps) {
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (window.instgrm && !hasProcessed.current) {
            window.instgrm.Embeds.process();
            hasProcessed.current = true;
        }
    }, [posts]);

    return (
        <>
            <Script
                src="https://www.instagram.com/embed.js"
                strategy="afterInteractive"
                onLoad={() => {
                    if (window.instgrm) {
                        window.instgrm.Embeds.process();
                    }
                }}
            />

            <Carousel opts={{ align: "start" }} className="w-full relative">
                <div className="absolute right-12 -top-12 flex">
                    <p className="text-pink-700 font-extrabold mr-10">Ver Todos</p>
                    <div>
                        <CarouselPrevious className="left-24 rounded-none" style={{ borderRadius: "5px" }} />
                        <CarouselNext className="rounded-none" style={{ borderRadius: "5px" }} />
                    </div>
                </div>

                <CarouselContent className="flex gap-[1px] px-3">
                    {posts.length === 0 ? (
                        <div className="flex justify-center items-center">Nenhum post encontrado</div>
                    ) : (
                        posts.map((post) => (
                            <CarouselItem
                                key={post.id}
                                className="flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/3"
                            >
                                <div className="relative flex flex-col bg-white border border-neutral-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow min-h-[500px]">
                                    <blockquote
                                        className="instagram-media"
                                        data-instgrm-permalink={`${post.link}?utm_source=ig_embed&amp;utm_campaign=loading`}
                                        data-instgrm-version="14"
                                        style={{
                                            background: '#FFF',
                                            border: '0',
                                            borderRadius: '3px',
                                            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                                            margin: '1px',
                                            maxWidth: '540px',
                                            minWidth: '326px',
                                            padding: '0',
                                            width: '100%',
                                            height: '570px',
                                        }}
                                    />
                                </div>
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
            </Carousel>

            {instagramUrl && (
                <div className="mt-10 text-center">
                    <Link
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-pink-700 hover:bg-pink-600 text-white font-semibold uppercase text-sm px-6 py-3 rounded-md transition-all"
                    >
                        Ver más en Instagram
                    </Link>
                </div>
            )}
        </>
    );
}