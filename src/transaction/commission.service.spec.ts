import { CommissionService } from './commission.service';

describe('CommissionService', () => {
  let commissionService: CommissionService;

  beforeEach(() => {
    commissionService = new CommissionService();
  });

  it('should have commission of 0.05 EUR if commission is less than 0.5 EUR and no other rules apply', async () => {
    const mockCommissionInput = {
      base_amount: 1,
      base_total: 0,
      client_id: 1,
    };

    const result = commissionService.calculateCommission(mockCommissionInput);

    expect(result).toBe(0.05);
  });

  it('should apply 0.5% commission if user has no discount and turnover is <= 1000 EUR month', async () => {
    const mockCommissionInput = {
      base_amount: 1000.0,
      base_total: 1000,
      client_id: 1,
    };

    const result = commissionService.calculateCommission(mockCommissionInput);

    expect(result).toBe(5);
  });

  it('should apply fixed 0.05 EUR commission if client_id is 42 and turnover <= 1000 EUR month', async () => {
    const mockCommissionInput = {
      base_amount: 1000.0,
      base_total: 1000,
      client_id: 42,
    };

    const result = commissionService.calculateCommission(mockCommissionInput);

    expect(result).toBe(0.05);
  });

  it('should apply fixed 0.03 EUR commission if client_id is 42 and turnover > 1000 EUR month', async () => {
    const mockCommissionInput = {
      base_amount: 1000.0,
      base_total: 1000.01,
      client_id: 42,
    };

    const result = commissionService.calculateCommission(mockCommissionInput);

    expect(result).toBe(0.03);
  });

  it('should apply fixed 0.03 EUR commission if turnover > 1000 EUR month', async () => {
    const mockCommissionInput = {
      base_amount: 1000.0,
      base_total: 1000.01,
      client_id: 1,
    };

    const result = commissionService.calculateCommission(mockCommissionInput);

    expect(result).toBe(0.03);
  });
});
