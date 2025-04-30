"use client"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginacaoProps {
    data: Array<{ id: string }>;
    totalRecords: number;
}

export default function Paginacao({ data, totalRecords }: PaginacaoProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const pageSize = 10;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const currentPage = parseInt(searchParams.get('page') || '1');

    function handlePageChange(page: number) {
        const params = new URLSearchParams(searchParams.toString());

        if (searchParams.has('search')) {
            params.delete('search');
        }

        if (page > 1) {
            params.set('page', page.toString());
        } else {
            params.delete('page');
        }

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1); 
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1); 
        }
    };

    return (
        <Pagination className="mt-10">
            <PaginationContent>
                {/* Conditionally render the Previous button */}
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault(); 
                                handlePrevious(); 
                            }}
                        />
                    </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(index + 1); 
                            }}
                            className={currentPage === index + 1 ? "bg-blue-500 text-white cursor-pointer" : "cursor-pointer"}
                        >
                            {index + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>

                {/* Conditionally render the Next button */}
                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault(); 
                                handleNext(); 
                            }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
