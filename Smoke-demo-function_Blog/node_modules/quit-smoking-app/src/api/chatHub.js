import { HubConnectionBuilder } from '@microsoft/signalr';

const connection = new HubConnectionBuilder()
  .withUrl('http://localhost:5050/chathub') // Đổi URL nếu cần
  .withAutomaticReconnect()
  .build();

export default connection;