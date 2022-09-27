import { Injectable, Logger } from '@nestjs/common';
import { ShuttleRouteService } from 'src/shuttle-route/shuttle-route.service';

@Injectable()
export class KakaoChatService {
  constructor(private readonly shuttleRouteService: ShuttleRouteService) {}
}
