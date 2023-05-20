fetch('/api/auth/login', {
  method: 'post',
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify({ login: 'test', password: 'check123' }),
});

fetch('/api/users/current', {
  method: 'put',
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify({
    login: 'test',
    password: 'check123',
    cardRequisites: { number: '1231111', date: '10/29', cvv: '777' },
  }),
});

fetch('/api/users/current', {
  method: 'post',
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify({
    login: 'test',
    password: 'check123',
  }),
});

fetch('/api/order', {
  method: 'post',
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify({
    bikeId: '123',
  }),
});
