import {VisibilityEnum} from "./service/video.service"
import {DropdownOption} from "./components/basic/dropdown/dropdown.component"

export class Utils{
  static time = {
    msPerSecond: 1000,
    msPerMinute: 1000 * 60,
    msPerHour: 1000 * 60 * 60,
    msPerDay: 1000 * 60 * 60 * 24,
    msPerMonth: 1000 * 60 * 60 * 24 * 30,
    msPerYear: 1000 * 60 * 60 * 24 * 30 * 12
  }

  static toRelativeTimeString(timestamp: Date | string | number): string {
    timestamp = this.anyToDate(timestamp)

    let timeElapsed = new Date().valueOf() - timestamp.valueOf();

    if (timeElapsed < this.time.msPerMinute) {
      return Math.round(timeElapsed / 1000) + ' seconds ago';
    }

    else if (timeElapsed < this.time.msPerHour) {
      return Math.round(timeElapsed / this.time.msPerMinute) + ' minutes ago';
    }

    else if (timeElapsed < this.time.msPerDay) {
      return Math.round(timeElapsed / this.time.msPerHour) + ' hours ago';
    }

    else if (timeElapsed < this.time.msPerMonth) {
      return Math.round(timeElapsed / this.time.msPerDay) + ' days ago';
    }

    else if (timeElapsed < this.time.msPerYear) {
      return Math.round(timeElapsed / this.time.msPerMonth) + ' months ago';
    }

    else {
      return Math.round(timeElapsed / this.time.msPerYear) + ' years ago';
    }
  }

  static toTimeDurationString(timestamp: Date | string | number){
    if(timestamp == null) return "unknown";

    let timeDate = this.anyToDate(timestamp);
    let timeMilliseconds = timeDate.valueOf();

    if(timeMilliseconds > this.time.msPerYear) {
      return timeDate.getFullYear() + ' years ' + Math.floor(timeMilliseconds % this.time.msPerYear / this.time.msPerMonth) + ' months';
    }
    else if (timeMilliseconds > this.time.msPerMonth) {
      return Math.floor(timeMilliseconds / this.time.msPerMonth) + ' months ' + Math.floor(timeMilliseconds % this.time.msPerMonth / this.time.msPerDay) + 'days';
    }
    else if (timeMilliseconds > this.time.msPerDay) {
      return Math.floor(timeMilliseconds / this.time.msPerDay) + ' days ' + timeDate.getHours() + 'hours';
    }
    else if (timeMilliseconds > this.time.msPerHour) {
      return Utils.padNumber(timeDate.getHours(),2) + ':' + Utils.padNumber(timeDate.getMinutes(),2) + ':' + Utils.padNumber(timeDate.getSeconds(),2);
    }
    else /*if (timeMilliseconds > this.time.msPerMinute)*/ {
      return Utils.padNumber(timeDate.getMinutes(),2) + ':' + Utils.padNumber(timeDate.getSeconds(),2);
    }
    /*else {
      return timeDate.getSeconds() + ' seconds';
    }*/
  }

  static toFullDateTimeString(timestamp: Date | string | number, options: {dateSeperator: string, timeSeperator: string} = {dateSeperator: '.', timeSeperator: ':'}){
    timestamp = this.anyToDate(timestamp);

    return Utils.padNumber(timestamp.getDate()) + options.dateSeperator +
           Utils.padNumber(timestamp.getMonth() + 1) + options.dateSeperator +
           timestamp.getFullYear().toString().substring(2,4) + ' ' +

           Utils.padNumber(timestamp.getHours()) + options.timeSeperator +
           Utils.padNumber(timestamp.getMinutes())
  }

  static toFullDateString(timestamp: Date | string | number, options: {dateSeperator: string} = {dateSeperator: '.'}) {
    timestamp = this.anyToDate(timestamp);

    return Utils.padNumber(timestamp.getDate()) + options.dateSeperator +
           Utils.padNumber(timestamp.getMonth() + 1) + options.dateSeperator +
           timestamp.getFullYear().toString().substring(2,4)
  }

  static anyToDate(timestamp: Date | string | number){
    if(timestamp == null) return new Date(0);
    if(typeof timestamp == "string") {
      return new Date(timestamp);
    }
    else if(typeof timestamp == "number") {
      return new Date(timestamp*1000);
    }
    else
      return timestamp;
  }

  static padNumber(number: number, length: number = 2){
    return number.toString().padStart(length, '0')
  }

  static roundNumber(num: number, digits:number): number {
    return parseFloat(num.toFixed(digits));
  }

  static visibilityEnumAsDropdownOption():DropdownOption[]{
    let options = [];
    for(let visibility in VisibilityEnum){
      options.push({
        id: visibility,
        name: visibility
      })
    }
    return options;
  }

  static generateRandomColor(): string {
    // Generate a random hue value between 0 and 360
    const hue = Math.floor(Math.random() * 360);
    // Set saturation to 100% for vibrant colors
    const saturation = 100;
    // Set lightness to a value between 40% and 80% for a wider spectrum
    const lightness = Math.floor(Math.random() * 41) + 40;

    // Convert HSL to RGB
    const hslToRgb = (h: number, s: number, l: number) => {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
    };

    const [r, g, b] = hslToRgb(hue, saturation, lightness);

    // Convert RGB to Hex
    const rgbToHex = (r: number, g: number, b: number) =>
      `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

    return rgbToHex(r, g, b);
  }

  static numberToLetter(number: number, lowercase: boolean = false): string {
    const lettersUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lettersLower = 'abcdefghijklmnopqrstuvwxyz';
    return lowercase ? lettersLower[number % 26] : lettersUpper[number % 26]
  }

  static spinAnimation(element: HTMLElement){
    if(element.classList.contains('spinning')) return //prevents adding multiple animations

    element.classList.add('spinning')

    let rotation = 0;

    let interval = setInterval(() => {
      element.animate([
        {transform: `rotate(${rotation}deg)`},
        {transform: `rotate(${rotation += 45}deg)`}
      ], {
        duration: 50,
        fill: 'forwards',
        easing: 'ease-in-out'
      })
      if(!document.body.contains(element)){ //auto remove spinning if element is removed from DOM
        clearInterval(interval)
        element.classList.remove('spinning')
      }
    }, 500)
  }
}
