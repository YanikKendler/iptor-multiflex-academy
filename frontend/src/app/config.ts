export abstract class Config{
  static USER_ID: number = 1;
  static BACKEND_URL: string = 'http://localhost:8080';
  static API_URL: string = Config.BACKEND_URL + '/api';
}
