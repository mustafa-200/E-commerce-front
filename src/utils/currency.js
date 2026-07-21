// مصدر واحد موحّد لعرض العملة في كل الموقع (الجنيه المصري).
// أي تغيير للعملة مستقبلاً بيتم من هنا بس، مش هيتفتش في كل الملفات.
export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  const formatted = value.toLocaleString("ar-EG", { maximumFractionDigits: 2 });
  return `${formatted} ج.م`;
}

// نسخة مختصرة لو محتاجين الرقم لوحده من غير كلمة العملة (زي حسابات الفرق بين سعرين)
export function formatNumber(amount) {
  return Number(amount).toLocaleString("ar-EG", { maximumFractionDigits: 2 });
}
