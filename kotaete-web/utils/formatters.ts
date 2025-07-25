export const formatDeadline = (deadline: string | Date) => {
  if (!deadline) return '設定なし';
  const date = new Date(deadline);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};
