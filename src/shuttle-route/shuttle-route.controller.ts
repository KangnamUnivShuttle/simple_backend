import { Controller, Get } from '@nestjs/common';
import { ShuttleRouteService } from './shuttle-route.service';

@Controller('shuttleroute')
export class ShuttleRouteController {
  constructor(private readonly shuttleRouteService: ShuttleRouteService) {}

  @Get('healthcheck')
  healthCheck(): string {
    return this.shuttleRouteService.sheetTitle;
  }
}
