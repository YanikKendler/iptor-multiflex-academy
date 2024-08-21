export abstract class Config{
  static USER_ID: number = localStorage.getItem('USER_ID') ? parseInt(localStorage.getItem('USER_ID')!) : 0;
  static BACKEND_URL: string = 'http://localhost:8080';
  static API_URL: string = Config.BACKEND_URL + '/api';
}
