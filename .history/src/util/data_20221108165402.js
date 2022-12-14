export function parseDate(tdate) {
  const created = new Date(Date.parse(tdate));
  const now = new Date();
  const diff = Math.floor((now - created) / 1000);

  if (diff <= 86400) {
    return chatTime(created);
  }

  const month = created.toLocaleDateString('default', { month: 'long' });
  return `${month} ${created.getDate()}일`;
}

export function reportDate(tdate) {
  const created = new Date(tdate);
  return created.toLocaleString();
}

export function chatTime(tDate) {
  const created = new Date(tDate);
  console.log(tDate);
  console.log(created);
  return `${created.getHours()}:${created.getMinutes()}`;
}
