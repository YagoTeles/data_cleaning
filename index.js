import fs from "fs";
import { parse } from "csv-parse";

console.log("----------------Início da Leitura de dados----------------\n");

fs.createReadStream("./Base_de_Alunos5.csv")
.pipe(parse({ delimiter: ";", from_line: 2 }))

.on("data", function (row) {
  //console.log(row);
  console.log(handledata(row));
})
.on("end", function () {
  console.log("\n----------------Fim da Leitura de dados-------------------");
})
.on("error", function (error) {
  console.log(error.message);
});

const handledata = (row) => {
  if(row === null || undefined) return ''
  const obj = {
                id: row[0],
                nome:row[1],
                nome_da_mae:row[2],
                nome_do_pai:row[3],
                sexo:row[4].toUpperCase(),
                data_de_nascimento: newDate(row[5]),
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
  if (parseInt(day) > 31 || parseInt(month) > 12 || parseInt(year) > currentDate.getFullYear()) return ''

  else{
    if(day.length === 1) day = '0' + day
    if(month.length === 1) month = '0' + month
    return [day,month,year].join("/");
  }
   
  
}
