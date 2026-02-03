"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type SearchResultListProps = {
  children: ReactNode;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isEmpty: boolean;
  total: number;
  fetchNextPage: () => void;
};

function SearchResultList({
  children,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isEmpty,
  total,
  fetchNextPage,
}: SearchResultListProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        총 {total.toLocaleString()}개의 결과
      </p>
      {children}
      <div ref={observerRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="space-y-2 rounded-lg border p-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      )}
    </div>
  );
}

export default SearchResultList;
