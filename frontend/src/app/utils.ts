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

  static toFullTimeString(timestamp: Date | string | number){
    timestamp = this.anyToDate(timestamp);

    return Utils.padNumber(timestamp.getDate()) + '/' +
           Utils.padNumber(timestamp.getMonth() + 1) + '/' +
           timestamp.getFullYear().toString().substring(2,4) + ' ' +

           Utils.padNumber(timestamp.getHours()) + ':' +
           Utils.padNumber(timestamp.getMinutes())
  }

  static anyToDate(timestamp: Date | string | number){
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
    return "#ABCDEF"
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
