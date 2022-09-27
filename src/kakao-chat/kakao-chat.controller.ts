import { Controller, Logger } from '@nestjs/common';
import { KakaoChatService } from './kakao-chat.service';

@Controller('kakaochat')
export class ShuttleRouteController {
  constructor(private readonly kakaoChatService: KakaoChatService) {}
}
