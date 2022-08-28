import fs from "fs";
import { parse } from "csv-parse";

export default function readBaseOnibus(){
  let readingData = []
  fs.createReadStream("./dataBase/Base de Onibus5.csv")
  .pipe(parse({ delimiter: ";", from_line: 2 }))

  .on("data", (row) => {
    
    readingData.push(handledata(row));
    
   
  })
  .on("end", () => {
    const csvData = objectToCsv(readingData);
   
    const w = fs.createWriteStream('./results/dadosOnibus.csv');
    w.write(csvData)
    console.log('Dados dos Onibus gravados no diretório:')
    console.log('\x1b[36m%s\x1b[0m',"./results/dadosOnibus.csv");
    console.log("\x1b[31m%s\x1b[0m","----------------------------------------")
  })
  .on("error", (error) => {
    console.log(error.message);
  });

  const handledata = (row) => {
    if(row === null || undefined) return ''
    const obj = {
                  id: row[0],
                  nome:row[1],
                  nome_da_mae:row[2],
                  nome_do_pai:row[3],
                  sexo:trataSexo(row[4].toUpperCase()),
                  data_de_nascimento: newDate(row[5]),
                  onibus:row[6]
                }
    return obj
  }
  const trataSexo = (string) =>{
    if (string === 'M') return 'F'
    else if(string === 'H') return 'M'
    else return ''
  }
  const newDate = (date) => {
    if(date === null || undefined) return ''

    const currentDate = new Date();
    
    const nDate = date.split("");

    let year
    let month
    let day

    if(nDate.length === 8){
        year = nDate[4]+nDate[5]+nDate[6]+nDate[7];
        month = nDate[2]+nDate[3];
        day = nDate[0] + nDate[1];
    }
    if(nDate.length === 7){
        year = nDate[3]+nDate[4]+nDate[5]+nDate[6];
        month = nDate[1]+nDate[2];
        day = nDate[0];
    }
    if(nDate.length === 6){
        year = nDate[2]+nDate[3]+nDate[4]+nDate[5];
        month = nDate[1];
        day = nDate[0];
    }
    if(nDate.length === 5){
        year = nDate[1]+nDate[2]+nDate[3]+nDate[4];
        month = nDate[0];
        day = '01';
    }

    if(day.length === 1) day = '0' + day
    if(month.length === 1) month = '0' + month

    //Arruma Ano-------------
    if(year[0] && year[1] === '0' && parseInt(year) < 23) year = '20'+year[2] + year[3];
    if(parseInt(year) > currentDate.getFullYear()){  
      if(parseInt(year[0]) > 2) year = year.replaceAt(0,'2');
      if(year[0] === '2'){
        if(parseInt(year[1]) > 0) year = year.replaceAt(1,'0');
        if(parseInt(year[2]) > 2) year = year.replaceAt(2,'2');
        if(parseInt(year[3]) > 2) year = year.replaceAt(3,'2');
      } 
    }
    if(parseInt(year) < 1900){ 
      if(year[0] === '0') year = year.replaceAt(0,'1');
      if(parseInt(year[0]) > 1) year = year.replaceAt(0,'1');
      if(year[0] === '1'){
        
        if(parseInt(year[1]) < 9) year = year.replaceAt(1,'9');
        if(parseInt(year[2]) < 5) year = year.replaceAt(2,'9');
      } 
      
    }

    //Arruma Mes--------------
    if(month === '00' ) month = '01'
    if(parseInt(month) > 12) {
      if(parseInt(month[0])>1) month = month.replaceAt(0,'1')
      if(parseInt(month[1])>2) month = '0' + month[1]
    }
    //Arruma Dia---------------------    

      if(day === '00' ) day = '01'
      if(parseInt(day) > 31) {
        if(parseInt(day[0])>3) day = day.replaceAt(0,'3')
        if(parseInt(day[1])>2) day = '31'
      }
      if(parseInt(day) > 28){
        const MaxDayToMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        if(parseInt(day) > MaxDayToMonth[parseInt(month)-1]) day = MaxDayToMonth[parseInt(month)-1].toString()
      }
    //-------------------------------  
      return [day,month,year].join("/");
  }

  String.prototype.replaceAt = function(index,newChar)
  {
    let tmp = this.split('')
    tmp[index] = newChar
    
    return tmp.join('')
  }

  const objectToCsv = function (data) {

    const csvRows = [];

  
    const headers = Object.keys(data[0]);

    csvRows.push(headers.join(';'));

    
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header]
            return `"${val}"`;
        });

        
        csvRows.push(values.join(';'));
    }

    return csvRows.join('\n');
  };

}





