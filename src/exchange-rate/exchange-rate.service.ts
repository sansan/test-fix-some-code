import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ExchangeRateInput,
  ExchangeRateResponse,
  URL,
} from './exchange-rate.interface';
import { Currency } from 'src/config/constants';
import formatCurrency from 'src/utils/formatCurrency';
@Injectable()
export class ExchangeRateService {
  constructor(private httpService: HttpService) {}

  async convertCurrency({
    from,
    amount,
    date,
  }: ExchangeRateInput): Promise<ExchangeRateResponse['result']> {
    if (from === Currency.EUR) {
      return amount;
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ExchangeRateResponse>(
          `${URL.exchangeRateConvertUrl}?from=${from}&to=EUR&amount=${amount}&date=${date}`,
        ),
      );

      return formatCurrency({ currency: Currency.EUR, amount: data.result });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
