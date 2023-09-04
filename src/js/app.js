import { interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const messagesTable = document.getElementById('messagesTable').getElementsByTagName('tbody')[0];

// const data = [
//   {
//     id: '1',
//     from: 'anya@ivanova',
//     subject: 'Hello from Anya',
//     received: 1630387200
//   },
//   {
//     id: '2',
//     from: 'alex@petrov',
//     subject: 'Hello from Alex Petrov!',
//     received: 1630397200
//   }
// ];

console.log('Интервал запущен')
interval(5000)
  .pipe(
    switchMap(() => {
      return ajax.getJSON('http://localhost:3031/messages/unread')
        .pipe(
          catchError(() => [])
        );
    })
  )
  .subscribe(response => {
    console.log('Ответ от сервера:', response)
    if (response && response.messages) {
      messagesTable.innerHTML = '';

      const messages = response.messages;

      messages.forEach(message => {
        console.log('Сообщение для отображения:', message)
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${message.from}</td>
          <td>${message.subject.length > 15 ? message.subject.slice(0, 15) + '...' : message.subject}</td>
          <td>${formatDate(message.received)}</td>
        `;
        messagesTable.appendChild(row);
      });
    }
  });

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}


