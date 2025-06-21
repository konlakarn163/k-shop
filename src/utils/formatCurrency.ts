export function formatTHB(amount: number): string {
  if (isNaN(amount)) return "";
  return amount.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });
}