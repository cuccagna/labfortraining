//Formatto la data a mio piacimento
  export default function date2String(dataString: string): string {
     let data = new Date(dataString);
     let day:string = data.getDate().toString(),
        month:string = (data.getMonth()+1).toString(),
        year:string = data.getFullYear().toString(),
        hour:string = data.getHours().toString(),
        minute:string = data.getMinutes().toString();
     
     month = month.padStart(2, '0');
     day = day.padStart(2, '0');
     hour = hour.padStart(2, '0');
     minute = minute.padStart(2, '0');
     

    return `
      ${day}/${month}/${year} ${hour}:${minute}
    `
  }
