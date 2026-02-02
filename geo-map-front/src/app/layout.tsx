import { Suspense } from "react";
import QueryProvider from "@/components/layout/QueryProvider";
import PolygonMap from "@/components/layout/PolygonMap";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <div className="relative h-screen w-full">
            {/* 배경: 지도 (모든 페이지에서 공유) */}
            <Suspense fallback={null}>
              <PolygonMap />
            </Suspense>
            {/* 페이지 컨텐츠 (지도 위에 오버레이) */}
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
