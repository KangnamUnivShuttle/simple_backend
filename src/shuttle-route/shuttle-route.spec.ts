import { Test, TestingModule } from '@nestjs/testing';
import { ShuttleRouteController } from './shuttle-route.controller';
import { ShuttleRouteService } from './shuttle-route.service';
import { Logger } from '@nestjs/common';

describe('AppController', () => {
  // let appController: AppController;
  let shuttleRouteController: ShuttleRouteController;
  let shuttleRouteService: ShuttleRouteService;

  function delay() {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 4000);
    });
  }

  beforeEach(async () => {
    const logger = new Logger('KafkaProvider');
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ShuttleRouteController],
      providers: [ShuttleRouteService],
    })
      .setLogger(logger)
      .compile();

    shuttleRouteService = app.get<ShuttleRouteService>(ShuttleRouteService);
    shuttleRouteController = app.get<ShuttleRouteController>(
      ShuttleRouteController,
    );

    await delay();
  });

  describe('root', () => {
    it('health check', () => {
      expect(shuttleRouteController.healthCheck()).not.toBeNull();
    });

    it('route list should more than 0', () => {
      expect(shuttleRouteController.getRoutes().length).not.toBe(0);
    });

    it('should return schedule list if input exist route', () => {
      const routeName = shuttleRouteController.getRoutes()[0];
      expect(
        shuttleRouteController.getRouteSchedule(routeName).data.length,
      ).not.toBe(0);
    });

    it('should not return schedule list if input is unexist route', () => {
      expect(shuttleRouteController.getRouteSchedule('foo')).toEqual({
        data: [],
        error: 'Undefined route name detected',
      });
    });

    it('Should return error if schedule empty', () => {
      shuttleRouteService.getRouteSchedule = () => {
        return [];
      };
      try {
        shuttleRouteService.getFastestBusTimeIdx('foo', 0);
      } catch (err) {
        expect(err.message).toBe('Schedule is empty');
      }

      // expect(shuttleRouteService.getFastestBusTimeIdx('foo', 0)).toThrow(
      //   new Error('Schedule is empty'),
      // );
    });

    it('Should return error if current time is out of range', () => {
      shuttleRouteService.getRouteSchedule = () => {
        return ['8:00', '8:30', '9:30'];
      };
      try {
        shuttleRouteService.getFastestBusTimeIdx('foo', -9999);
      } catch (err) {
        expect(err.message).toBe('Time sec is out of range');
      }
    });

    it('Should return error if current time is out of range', () => {
      shuttleRouteService.getRouteSchedule = () => {
        return ['8:00', '8:30', '9:30'];
      };
      try {
        shuttleRouteService.getFastestBusTimeIdx('foo', 9999);
      } catch (err) {
        expect(err.message).toBe('Time sec is out of range');
      }
    });
    it('Should return error if schedule length <= 2', () => {
      shuttleRouteService.getRouteSchedule = () => {
        return ['8:00', '8:30'];
      };
      try {
        shuttleRouteService.getFastestBusTimeIdx('foo', 480);
      } catch (err) {
        expect(err.message).toBe(
          'Not enough schedule data. At least 3 schedule required',
        );
      }
    });

    it('Should return first idx', () => {
      shuttleRouteService.getRouteSchedule = () => {
        return ['8:00', '8:30', '9:30'];
      };
      expect(shuttleRouteService.getFastestBusTimeIdx('foo', 480)).toEqual({
        thisTimeIdx: 0,
        nextTimeIdx: 1,
      });
    });

    it('Should return second idx', () => {
      shuttleRouteService.getRouteSchedule = () => {
        return ['8:00', '8:30', '9:30'];
      };
      expect(shuttleRouteService.getFastestBusTimeIdx('foo', 510)).toEqual({
        thisTimeIdx: 1,
        nextTimeIdx: 2,
      });
    });

    it('Should return third idx', () => {
      shuttleRouteService.getRouteSchedule = () => {
        return ['8:00', '8:30', '9:30'];
      };
      expect(shuttleRouteService.getFastestBusTimeIdx('foo', 511)).toEqual({
        thisTimeIdx: 2,
        nextTimeIdx: -1,
      });
    });
    it('Should return -1 idx', () => {
      shuttleRouteService.getRouteSchedule = () => {
        return ['8:00', '8:30', '9:30'];
      };
      expect(shuttleRouteService.getFastestBusTimeIdx('foo', 571)).toEqual({
        thisTimeIdx: -1,
        nextTimeIdx: -1,
      });
    });
  });
});
