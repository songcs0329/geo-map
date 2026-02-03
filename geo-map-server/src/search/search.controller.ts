import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('blog')
  searchBlog(@Query() query: SearchQueryDto) {
    return this.searchService.searchBlog(query);
  }

  @Get('news')
  searchNews(@Query() query: SearchQueryDto) {
    return this.searchService.searchNews(query);
  }

  @Get('cafearticle')
  searchCafe(@Query() query: SearchQueryDto) {
    return this.searchService.searchCafe(query);
  }

  @Get('local')
  searchLocal(@Query() query: SearchQueryDto) {
    return this.searchService.searchLocal(query);
  }
}
