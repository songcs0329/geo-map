"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stripHtmlTags } from "@/lib/utils";
import type { LocalItem } from "@/types/shared/naver-search.types";

type LocalItemCardProps = {
  item: LocalItem;
};

function LocalItemCard({ item }: LocalItemCardProps) {
  return (
    <Card className="hover:bg-accent cursor-pointer transition-colors">
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-sm font-medium">
            {stripHtmlTags(item.title)}
          </CardTitle>
          <CardDescription className="text-xs">
            {item.category}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-muted-foreground text-xs">
            {item.roadAddress || item.address}
          </p>
          {item.telephone && (
            <p className="text-muted-foreground text-xs">{item.telephone}</p>
          )}
          {item.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {stripHtmlTags(item.description)}
            </p>
          )}
        </CardContent>
      </a>
    </Card>
  );
}

export default LocalItemCard;
