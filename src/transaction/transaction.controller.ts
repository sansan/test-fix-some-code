import {
  Controller,
  Post,
  Get,
  ValidationPipe,
  Body,
  UsePipes,
} from '@nestjs/common';
import { ExchangeRateService } from 'src/exchange-rate/exchange-rate.service';
import { TransactionService } from './transaction.service';
import { CommissionService } from './commission.service';

import { TransactionBodyDto } from './transaction.dto';
import { Currency } from 'src/config/constants';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly commissionService: CommissionService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async commission(
    @Body()
    transactionInput: TransactionBodyDto,
  ) {
    const { amount, currency, date, client_id } = transactionInput;

    const base_amount = await this.exchangeRateService.convertCurrency({
      amount,
      from: currency,
      date,
    });

    const base_total =
      await this.transactionService.findTurnoverForClientInTransactionMonth(
        client_id,
        date,
      );

    const commission = this.commissionService.calculateCommission({
      base_total,
      base_amount,
      client_id,
    });

    await this.transactionService.insertOne({
      client_id,
      date,
      base_amount,
      base_currency: Currency.EUR,
      amount,
      currency,
      commission,
    });

    return { commission, currency: Currency.EUR };
  }

  @Get('clear')
  public async deleteAll() {
    return this.transactionService.deleteAll();
  }
}
