import { Injectable } from '@nestjs/common';
import formatCurrency from 'src/utils/formatCurrency';

import { commissionRules, RuleDefinition } from 'src/config/commission';

type RuleInput = {
  client_id: number;
  base_amount: number;
  base_total: number;
};

@Injectable()
export class CommissionService {
  private getCommissionValue(rule: RuleDefinition, input: RuleInput): number {
    if (rule.type === 'percentage') {
      const rate = input.base_amount * (rule.rate / 100);

      return rate > rule.minRate ? rate : rule.minRate;
    }

    return rule.rate;
  }

  private isRuleApplicable(
    rule: RuleDefinition,
    transactionDetails: RuleInput,
  ): boolean {
    if (
      rule?.client_ids &&
      !rule?.client_ids?.includes(transactionDetails.client_id)
    ) {
      return false;
    }

    if (rule.minTurnover && transactionDetails.base_total <= rule.minTurnover) {
      return false;
    }

    return true;
  }

  private applyRule(
    rule: RuleDefinition,
    transactionDetails: RuleInput,
  ): number {
    if (this.isRuleApplicable(rule, transactionDetails) === true) {
      console.log(`Applying rule ${rule.name}`, transactionDetails);
      return this.getCommissionValue(rule, transactionDetails);
    }

    console.log(`Not applying rule ${rule.name}`);

    return null;
  }

  public calculateCommission(input: RuleInput) {
    const possibleCommissions = commissionRules
      .map((rule) => this.applyRule(rule, input))
      .filter((element) => {
        return element !== null;
      });

    const commission = possibleCommissions.reduce((a, b) => Math.min(a, b));

    return formatCurrency({ amount: commission, currency: 'EUR' });
  }
}
