import {
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { Currency } from 'src/config/constants';
import formatCurrency from 'src/utils/formatCurrency';

export class TransactionBodyDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value, obj }) =>
    formatCurrency({ amount: value, currency: obj.currency }),
  )
  amount: number;

  @IsNotEmpty()
  @IsEnum(Currency)
  currency: string;

  @IsNotEmpty()
  @IsInt()
  client_id: number;
}
