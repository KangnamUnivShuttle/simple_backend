import { Injectable, Logger } from '@nestjs/common';
import * as GOOGLE_SHEET_AUTH from '../kangnamshuttle3-427ee94da2eb.json';
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
} from 'google-spreadsheet';

@Injectable()
export class ShuttleRouteService {
  sheetTitle: string;
  spreadSheet: GoogleSpreadsheet;
  scheduleHeaders: string[];
  scheduleDB: GoogleSpreadsheetRow[];
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
      const scheduleSheet = this.spreadSheet.sheetsByTitle['schedule'];
      this.sheetTitle = this.spreadSheet.title;
      this.scheduleDB = await scheduleSheet.getRows();
      this.logger.log(
        `[init] ok, title: ${this.sheetTitle} | ${this.scheduleDB.length}`,
      );
      //   console.log(this.scheduleDB[0]._rawData);
      this.scheduleHeaders = scheduleSheet.headerValues;
      this.logger.debug(
        `[init] routes: ${JSON.stringify(this.scheduleHeaders)}`,
      );
    } catch (err) {
      this.logger.error(`[init] err`, err.message);
    }
  }

  getRouteSchedule(routeName: string): string[] {
    if (!this.scheduleHeaders.includes(routeName)) {
      throw new Error(
        `[getRouteSchedule] Undefined route name detected : ${routeName}`,
      );
    }

    if (this.scheduleDB.length <= 0) {
      throw new Error(`[getRouteSchedule] schedule not ready`);
    }

    const routeIdx = this.scheduleHeaders.indexOf(routeName);
    return this.scheduleDB
      .map((row) => row._rawData[routeIdx])
      .filter((a) => a);
    //   https://stackoverflow.com/a/2843625
    // remove null from array
  }
}
