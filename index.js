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
  const obj = [{id: row[0],nome:row[1],nome_da_mae:row[2],nome_do_pai:row[3],sexo:row[4],data_de_nascimento:row[5]}]
  return obj
}
