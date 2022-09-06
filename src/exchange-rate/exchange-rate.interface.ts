import { Currency } from 'src/config/constants';

export enum URL {
  exchangeRateConvertUrl = 'https://api.exchangerate.host/convert',
}

export type ExchangeRateInput = {
  date: string;
  amount: number;
  from: string;
};

export type ExchangeRateResponse = {
  motd: {
    msg: string;
    url: string;
  };
  success: boolean;
  query: {
    from: Currency;
    to: Currency.EUR;
    amount: number;
  };
  info: {
    rate: number;
  };
  historical: boolean;
  date: string;
  result: number;
};
