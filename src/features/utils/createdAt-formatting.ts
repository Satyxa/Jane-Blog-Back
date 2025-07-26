export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const correctedDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);

  const diff = (now.getTime() - correctedDate.getTime()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  for (const [unit, secondsInUnit] of units) {
    const value = Math.floor(diff / secondsInUnit);
    if (value >= 1) {
      return rtf.format(-value, unit); // negative = "ago"
    }
  }

  return 'just now';
};
