import { Controller, Get, Param } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ShuttleRouteService } from './shuttle-route.service';

@Controller('shuttleroute')
export class ShuttleRouteController {
  private readonly logger = new Logger(ShuttleRouteController.name);
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
    try {
      return {
        error: null,
        data: this.shuttleRouteService.getRouteSchedule(routeName),
      };
    } catch (err) {
      this.logger.error(`[getRouteSchedule] err: ${err.message}`);
      return {
        data: [] as string[],
        error: err.message,
      };
    }
  }

  @Get('fastestbustime/:route')
  getFastestBusTimeFromRoute(@Param('route') routeName: string) {
    const currentTimeSec = this.shuttleRouteService.getCurrentTimeSec();
    return this.shuttleRouteService.fastestBustTimeIdxToString(
      routeName,
      this.shuttleRouteService.getFastestBusTimeIdx(routeName, currentTimeSec),
    );
  }
}
