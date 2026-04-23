export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getRelativeTime = (dateString: string): string => {
  const end = new Date(dateString);
  const now = new Date();
  
  let years = now.getFullYear() - end.getFullYear();
  let months = now.getMonth() - end.getMonth();
  let days = now.getDate() - end.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

  if (parts.length === 0) return 'Just recently';
  
  return parts.join(', ') + ' ago';
};
