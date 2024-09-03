export abstract class Config{
  static BACKEND_URL: string = 'http://localhost:8080';
  static API_URL: string = Config.BACKEND_URL + '/api';
  static SMALL_SCREEN: boolean = window.innerWidth < 900;

  static generateAproveContentTooltipText(type: "video" | "learningpath"): string {
    return `This ${type} is not approved yet, only you and the user who created it can see it. - After approval, the visibility can be changed.`;
  }
}

window.addEventListener('resize', () => {
  Config.SMALL_SCREEN = window.innerWidth < 900;
})
