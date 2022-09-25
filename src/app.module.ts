import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShuttleRouteController } from './shuttle-route/shuttle-route.controller';
import { ShuttleRouteService } from './shuttle-route/shuttle-route.service';

@Module({
  imports: [],
  controllers: [AppController, ShuttleRouteController],
  providers: [AppService, ShuttleRouteService],
})
export class AppModule {}
