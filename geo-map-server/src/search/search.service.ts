import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  NaverSearchResponse,
  BlogItem,
  NewsItem,
  CafeItem,
} from '../types/naver-search.types';
import { SearchQueryDto } from './dto/search-query.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('NAVER_API_BASE_URL') ||
      'https://openapi.naver.com/v1';
    this.clientId =
      this.configService.get<string>('NAVER_SEARCH_CLIENT_ID') || '';
    this.clientSecret =
      this.configService.get<string>('NAVER_SEARCH_CLIENT_SECRET') || '';

    if (!this.clientId || !this.clientSecret) {
      console.warn('Naver Search API credentials not configured');
    }
  }

  async searchBlog(
    dto: SearchQueryDto,
  ): Promise<NaverSearchResponse<BlogItem>> {
    return this.search<BlogItem>('/search/blog', dto);
  }

  async searchNews(
    dto: SearchQueryDto,
  ): Promise<NaverSearchResponse<NewsItem>> {
    return this.search<NewsItem>('/search/news', dto);
  }

  async searchCafe(
    dto: SearchQueryDto,
  ): Promise<NaverSearchResponse<CafeItem>> {
    return this.search<CafeItem>('/search/cafearticle', dto);
  }

  private async search<T>(
    path: string,
    dto: SearchQueryDto,
  ): Promise<NaverSearchResponse<T>> {
    if (!this.clientId || !this.clientSecret) {
      throw new HttpException(
        'Naver API credentials not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const params = new URLSearchParams({
      query: dto.query,
      display: String(dto.display ?? 10),
      start: String(dto.start ?? 1),
      sort: dto.sort ?? 'sim',
    });

    const url = `${this.baseUrl}${path}?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': this.clientId,
        'X-Naver-Client-Secret': this.clientSecret,
      },
    });

    if (!response.ok) {
      throw new HttpException(
        'Failed to fetch from Naver API',
        response.status,
      );
    }

    return response.json() as Promise<NaverSearchResponse<T>>;
  }
}
