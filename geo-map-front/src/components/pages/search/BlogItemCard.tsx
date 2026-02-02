"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPostDate, stripHtmlTags } from "@/lib/utils";
import type { BlogItem } from "@/types/shared/naver-search.types";

interface BlogItemCardProps {
  item: BlogItem;
}

function BlogItemCard({ item }: BlogItemCardProps) {
  return (
    <Card className="hover:bg-accent cursor-pointer transition-colors">
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-sm font-medium">
            {stripHtmlTags(item.title)}
          </CardTitle>
          <CardDescription className="text-xs">
            {item.bloggername} · {formatPostDate(item.postdate)}
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

export default BlogItemCard;
