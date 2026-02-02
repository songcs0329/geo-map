"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

// 브라우저 환경에서 QueryClient 싱글톤 유지
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * SSR/CSR Hydration을 위한 QueryClient 관리
 *
 * 서버(SSR):
 * - 매 요청마다 새로운 QueryClient 생성
 * - 요청 간 데이터 공유 방지 (보안, 메모리 누수 방지)
 *
 * 클라이언트(CSR):
 * - 싱글톤 패턴으로 QueryClient 재사용
 * - 컴포넌트 리렌더링 시에도 캐시 유지
 * - 초기 렌더링 시 서버에서 prefetch된 데이터로 hydration
 */
function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
