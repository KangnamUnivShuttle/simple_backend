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

  getCurrentTimeSec() {
    return new Date().getHours() * 60 + new Date().getMinutes();
  }

  fastestBustTimeIdxToString(
    routeName: string,
    fastestParam: { thisTimeIdx: number; nextTimeIdx: number },
  ): { thisTimeMsg: string; nextTimeMsg: string } {
    const schedule = this.getRouteSchedule(routeName);
    let thisTimeMsg = ``;
    let nextTimeMsg = ``;
    if (fastestParam.thisTimeIdx === 0) {
      thisTimeMsg = `첫 차 ${schedule[fastestParam.thisTimeIdx]}`;
    } else if (
      fastestParam.thisTimeIdx !== -1 &&
      fastestParam.nextTimeIdx === -1
    ) {
      thisTimeMsg = `마지막 차 ${schedule[fastestParam.thisTimeIdx]}`;
      nextTimeMsg = `운행 종료`;
    } else if (
      fastestParam.thisTimeIdx === -1 &&
      fastestParam.nextTimeIdx === -1
    ) {
      thisTimeMsg = nextTimeMsg = `운행 종료`;
    } else {
      thisTimeMsg = `이번 차 ${schedule[fastestParam.thisTimeIdx]}`;
      nextTimeMsg = `다음 차 ${schedule[fastestParam.nextTimeIdx]}`;
    }
    return {
      thisTimeMsg,
      nextTimeMsg,
    };
  }

  getFastestBusTimeIdx(
    routeName: string,
    currentTimeSec: number,
  ): { thisTimeIdx: number; nextTimeIdx: number } {
    const schedule = this.getRouteSchedule(routeName).map((time) => {
      return Number(time.split(':'))[0] * 60 + Number(time.split(':')[1]);
    });

    this.logger.debug(
      `[getFastestBusTime] current time: ${currentTimeSec} / route: ${routeName}`,
    );

    let fastestIdx = 0;
    for (let i = 0; i < schedule.length; i++) {
      if (currentTimeSec <= schedule[i]) {
        fastestIdx = 0;
        break;
      } else if (
        i + 1 < schedule.length &&
        schedule[i] < currentTimeSec &&
        currentTimeSec <= schedule[i + 1]
      ) {
        fastestIdx = i;
      } else if (i + 1 === schedule.length && currentTimeSec <= schedule[i]) {
        fastestIdx = i;
      } else {
        fastestIdx = -1;
      }
    }
    this.logger.debug(`[getFastestBusTime] fastest idx: ${fastestIdx}`);

    return {
      thisTimeIdx: fastestIdx,
      nextTimeIdx:
        fastestIdx === -1 || fastestIdx === schedule.length - 1
          ? -1
          : fastestIdx + 1,
    };
  }
}
