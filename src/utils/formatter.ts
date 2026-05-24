export const formatCurrencyPure = (value: number) => {
  return new Intl.NumberFormat("id-ID").format(value);
};
