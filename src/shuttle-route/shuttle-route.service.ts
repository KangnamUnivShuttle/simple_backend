import { Injectable, Logger } from '@nestjs/common';
import * as GOOGLE_SHEET_AUTH from '../kangnamshuttle3-427ee94da2eb.json';
import { GoogleSpreadsheet } from 'google-spreadsheet';

@Injectable()
export class ShuttleRouteService {
  sheetTitle: string;
  spreadSheet: GoogleSpreadsheet;
  private readonly logger = new Logger(ShuttleRouteService.name);

  constructor() {
    this.spreadSheet = new GoogleSpreadsheet(
      '1LNxaJByYGQZGqw3RiTI9uyj0-IIc6MP06X1ncQTllS8',
    );
    this.init();
  }

  async init() {
    try {
      await this.spreadSheet.useServiceAccountAuth(GOOGLE_SHEET_AUTH);
      await this.spreadSheet.loadInfo();
      this.sheetTitle = this.spreadSheet.title;
      this.logger.log(`[init] ok, title: ${this.sheetTitle}`);
    } catch (err) {
      this.logger.error(`[init] err`, err.message);
    }
  }
}
