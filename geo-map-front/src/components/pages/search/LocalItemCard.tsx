"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stripHtmlTags } from "@/lib/utils";
import type { LocalItem } from "@/types/shared/naver-search.types";
import { Fragment } from "react";

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
          <Breadcrumb>
            <BreadcrumbList className="text-xs sm:gap-1">
              {item.category.split(">").map((part, index, arr) => (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{part}</BreadcrumbPage>
                  </BreadcrumbItem>
                  {index < arr.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
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
