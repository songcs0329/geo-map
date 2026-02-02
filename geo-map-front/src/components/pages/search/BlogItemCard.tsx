"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BlogItem } from "@/types/shared/naver-search.types";

function stripHtmlTags(html: string): string {
  const withoutTags = html.replace(/<[^>]*>/g, "");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = withoutTags;
  return textarea.value;
}

function formatDate(dateStr: string): string {
  if (dateStr.length !== 8) return dateStr;
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${year}.${month}.${day}`;
}

interface BlogItemCardProps {
  item: BlogItem;
}

function BlogItemCard({ item }: BlogItemCardProps) {
  return (
    <Card className="cursor-pointer transition-colors hover:bg-accent">
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-sm font-medium">
            {stripHtmlTags(item.title)}
          </CardTitle>
          <CardDescription className="text-xs">
            {item.bloggername} · {formatDate(item.postdate)}
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

export default BlogItemCard;
