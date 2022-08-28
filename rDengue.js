import fs from "fs";
import { parse } from "csv-parse";

export default function readBaseDengue(){
  let readingData = []
  fs.createReadStream("./dataBase/Base de Dengue5.csv")
  .pipe(parse({ delimiter: ";", from_line: 2 }))

  .on("data", (row) => {
    
    readingData.push(handledata(row));
    
   
  })
  .on("end", () => {
    const csvData = objectToCsv(readingData);
   
    const w = fs.createWriteStream('./results/dadosDegue.csv');
    w.write(csvData)
    console.log('Dados da dengue gravados no diretório:')
    console.log('\x1b[36m%s\x1b[0m',"./results/dadosDengue.csv");
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
                  nome_da_mae:row[3],
                  nome_do_pai:row[2],
                  sexo:row[4].toUpperCase(),
                  data_de_nascimento: parseInt(newDate(row[6]).split('/')[2])> parseInt(newDate(row[5]).split('/')[2])  ? newDate(row[5]) : '',
                  data_da_dengue:newDate(row[6])
                }
    return obj
  }
  const newDate = (date) => {
    if(date === null || undefined) return ''

    const currentDate = new Date();
    const nDate = date.replace(/-/g, "/").split(" ")[0].split("/");
    let day = nDate[0];
    let month = nDate[1];
    let year = nDate[2];

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






