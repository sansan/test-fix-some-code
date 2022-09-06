import { Test } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CommissionService } from './commission.service';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const TransactionServiceProvider = {
      provide: TransactionService,
      useFactory: () => ({
        insertOne: jest.fn(() =>
          Promise.reject(new Error('DatabaseNotReachable')),
        ),
        findTurnoverForClientInTransactionMonth: jest.fn((clientId) => {
          if (clientId === 42) {
            return 1500.0;
          }
          return 0;
        }),
      }),
    };

    const ExchangeRateServiceProvider = {
      provide: ExchangeRateService,
      useFactory: () => ({
        convertCurrency: jest.fn(({ from, amount }) => {
          if (from === 'EUR') {
            return amount;
          }

          return amount * 0.5;
        }),
      }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionServiceProvider,
        CommissionService,
        ExchangeRateServiceProvider,
      ],
    }).compile();

    transactionService = moduleRef.get<TransactionService>(TransactionService);
    transactionController = moduleRef.get<TransactionController>(
      TransactionController,
    );
  });

  describe('create a transaction', () => {
    it('should return commission and currency in base currency in response', async () => {
      const result = {
        commission: 0.05,
        currency: 'EUR',
        base_amount: 100,
        amount: 100,
        base_currency: 'EUR',
        client_id: 1,
        date: '2022-06-06',
      };
      jest
        .spyOn(transactionService, 'insertOne')
        .mockImplementation(() => Promise.resolve(result));

      const res = await transactionController.commission({
        date: '2022-06-06',
        currency: 'EUR',
        amount: 1,
        client_id: 1,
      });

      console.log(res);

      expect(res.commission).toBe(result.commission);
      expect(res.currency).toBe(result.base_currency);
    });
  });
});
