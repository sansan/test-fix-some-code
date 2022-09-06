type FormatCurrencyInput = {
  currency: string;
  amount: number;
};

const formatCurrency = ({ currency, amount }: FormatCurrencyInput): number => {
  const currencyFractionDigits = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).resolvedOptions().maximumFractionDigits;

  return parseFloat(
    amount.toLocaleString('en-US', {
      useGrouping: false,
      maximumFractionDigits: currencyFractionDigits,
    }),
  );
};

export default formatCurrency;
