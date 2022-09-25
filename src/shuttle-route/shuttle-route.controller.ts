import { Controller, Get, Param } from '@nestjs/common';
import { ShuttleRouteService } from './shuttle-route.service';

@Controller('shuttleroute')
export class ShuttleRouteController {
  constructor(private readonly shuttleRouteService: ShuttleRouteService) {}

  @Get('healthcheck')
  healthCheck(): string {
    return this.shuttleRouteService.sheetTitle;
  }

  @Get('routes')
  getRoutes() {
    return this.shuttleRouteService.scheduleHeaders;
  }

  @Get('schedule/:route')
  getRouteSchedule(@Param('route') routeName: string) {
    return this.shuttleRouteService.getRouteSchedule(routeName);
  }

  @Get('fastestbustime/:route')
  getFastestBusTimeFromRoute(@Param('route') routeName: string) {
    return '';
  }
}
