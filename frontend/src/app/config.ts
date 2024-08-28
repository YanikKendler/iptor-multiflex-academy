export abstract class Config{
  static BACKEND_URL: string = 'http://localhost:8080';
  static API_URL: string = Config.BACKEND_URL + '/api';
  static SMALL_SCREEN: boolean = window.innerWidth < 900;
}

window.addEventListener('resize', () => {
  Config.SMALL_SCREEN = window.innerWidth < 900;
})
