export type RuleDefinition = {
  name: string;
  minTurnover?: number;
  client_ids?: number[];
  rate: number;
  minRate?: number;
  type: 'percentage' | 'amount';
};

const defaultRule: RuleDefinition = {
  name: 'Default Rule',
  minTurnover: 0,
  rate: 0.5,
  minRate: 0.05,
  type: 'percentage',
};

const clientRule: RuleDefinition = {
  name: 'VIP Rule',
  client_ids: [42],
  rate: 0.05,
  type: 'amount',
};

const turnoverRule: RuleDefinition = {
  name: 'Turnover >= 1000 EUR Rule',
  minTurnover: 1000,
  rate: 0.03,
  type: 'amount',
};

export const commissionRules: RuleDefinition[] = [
  defaultRule,
  clientRule,
  turnoverRule,
];
