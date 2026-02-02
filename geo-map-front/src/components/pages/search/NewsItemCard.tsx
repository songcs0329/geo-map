"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPubDate, stripHtmlTags } from "@/lib/utils";
import type { NewsItem } from "@/types/shared/naver-search.types";

interface NewsItemCardProps {
  item: NewsItem;
}

function NewsItemCard({ item }: NewsItemCardProps) {
  const linkUrl = item.originallink || item.link;

  return (
    <Card className="hover:bg-accent cursor-pointer transition-colors">
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
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {stripHtmlTags(item.description)}
          </p>
        </CardContent>
      </a>
    </Card>
  );
}

export default NewsItemCard;
