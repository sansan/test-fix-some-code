import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryResult } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async insertOne(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

  public async findTurnoverForClientInTransactionMonth(
    clientId,
    date,
  ): Promise<number> {
    const [result] = await this.transactionRepository.query(
      `SELECT client_id, SUM(base_amount) as total
      FROM transaction
      WHERE DATE_FORMAT(date, '%Y %m') = DATE_FORMAT(?, '%Y %m')
      AND client_id = ?
      GROUP BY client_id
      `,
      [date, clientId],
    );

    const { total } = result || { total: 0 };

    return total;
  }

  public async deleteAll(): Promise<QueryResult> {
    return this.transactionRepository.query(`TRUNCATE TABLE transaction`);
  }
}
