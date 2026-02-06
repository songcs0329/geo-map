import { Metadata } from "next";
import QueryProvider from "@/components/layout/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Geo Map - 행정구역 기반 지도 시각화",
    template: "%s | Geo Map",
  },
  description:
    "카카오 지도 위에 시/도, 시군구, 동 단위의 행정구역을 시각화하고 지역별 뉴스, 블로그, 카페, 장소 정보를 검색할 수 있는 서비스입니다.",
  keywords: [
    "행정구역",
    "지도",
    "GeoJSON",
    "카카오 지도",
    "지역 검색",
    "시도",
    "시군구",
    "동",
    "폴리곤",
  ],
  authors: [{ name: "Geo Map Team" }],
  openGraph: {
    title: "Geo Map - 행정구역 기반 지도 시각화",
    description:
      "카카오 지도 위에 시/도, 시군구, 동 단위의 행정구역을 시각화하고 지역별 정보를 검색하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
