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

  static toSmartTimeString(timestamp: Date | string | number){
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

    return timestamp.getFullYear() + '-' +
      Utils.padNumber(timestamp.getMonth() + 1) + '-' +
      Utils.padNumber(timestamp.getDate()) + ' ' +
      Utils.padNumber(timestamp.getHours()) + ':' +
      Utils.padNumber(timestamp.getMinutes())
  }

  static anyToDate(timestamp: Date | string | number){
    if(typeof timestamp != "object") {
      return new Date(timestamp);
    }
    else
      return timestamp;
  }

  static padNumber(number: number, length: number = 2){
    return number.toString().padStart(length, '0')
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
