import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { GeoJSONModule } from './geojson/geojson.module';
import { SearchModule } from './search/search.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : undefined,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    HealthModule,
    GeoJSONModule,
    SearchModule,
  ],
})
export class AppModule {}
