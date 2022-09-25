import { Controller, Get } from '@nestjs/common';
import { ShuttleRouteService } from './shuttle-route.service';

@Controller()
export class ShuttleRouteController {
  constructor(private readonly shuttleRouteService: ShuttleRouteService) {}

  @Get()
  healthCheck(): string {
    return this.shuttleRouteService.sheetTitle;
  }
}
