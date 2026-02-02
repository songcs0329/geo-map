"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NewsItem } from "@/types/shared/naver-search.types";

function stripHtmlTags(html: string): string {
  const withoutTags = html.replace(/<[^>]*>/g, "");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = withoutTags;
  return textarea.value;
}

function formatPubDate(pubDate: string): string {
  const date = new Date(pubDate);
  if (isNaN(date.getTime())) return pubDate;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

interface NewsItemCardProps {
  item: NewsItem;
}

function NewsItemCard({ item }: NewsItemCardProps) {
  const linkUrl = item.originallink || item.link;

  return (
    <Card className="cursor-pointer transition-colors hover:bg-accent">
      <a href={linkUrl} target="_blank" rel="noopener noreferrer">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-sm font-medium">
            {stripHtmlTags(item.title)}
          </CardTitle>
          <CardDescription className="text-xs">
            {formatPubDate(item.pubDate)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {stripHtmlTags(item.description)}
          </p>
        </CardContent>
      </a>
    </Card>
  );
}

export default NewsItemCard;
