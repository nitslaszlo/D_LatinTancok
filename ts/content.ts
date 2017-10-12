import * as http from "http";
import * as url from "url";
import * as fs from "fs";
import { Táncok } from "./Tancok";

export class Content {

   Content(req: http.ServerRequest, res: http.ServerResponse): void {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<form style='font-size:16px; background: LightGray'>");
      res.write("<pre style='font-family: Courier'>");

      const query: any = url.parse(req.url, true).query;
      const betanc: string = query.betanc === undefined ? "" : query.betanc;

      res.write("<p>1. feladat: Az adatok beolvasása</p>");
      const tanc: Táncok[] = [];
      const sor: string[] = fs.readFileSync("tancrend.txt").toString().split("\r\n");

      for (let i: number = 1; i < sor.length - 2; i = i + 3) {
         
         if (sor[i].length > 0) tanc.push(new Táncok(sor[i], sor[i + 1], sor[i + 2]));
         
      }

      res.write("<p>2. feladat: Az első tánc " + tanc[0].TáncNeve + " és az utolsó tánc " + tanc[tanc.length - 3].TáncNeve + " volt</p>");

      let db: number= 0;
      for (let i: number = 0; i < tanc.length; i++) {

         if (tanc[i].TáncNeve === "samba") {
            db = db + 1;
         }
      }

      res.write("<p>3. feladat: "+db+" pár mutatott be sambát</p>");

      res.write("<p>4. feladat: Vilma itt táncolt:</p>");

      for (let i: number = 0; i < tanc.length; i++) {

         if (tanc[i].név1 === "Vilma" || tanc[i].név2 === "Vilma") {
            res.write(tanc[i].TáncNeve + "\n");
         }
      }

      res.write("<p>5. feladat: Írjon be egy tánc nevet = <input type='text' " +
         "name= 'betanc' style= 'font-family:Courier; font - size: inherit; " +
         "background:LightGray;' value='" + betanc + "'><br>");
      
      let partner: number = 0;
      
      if (betanc != "")
      {
         for(let i: number = 0; i < tanc.length; i++) {         
            if (tanc[i].név1 === "Vilma" && tanc[i].TáncNeve === betanc) {
               res.write("A " + betanc + " bemutatóján Vilma párja " + tanc[i].név2 + " volt");
               partner += 1;
            }
            if (tanc[i].név2 === "Vilma" && tanc[i].TáncNeve === betanc) {
               res.write("A " + betanc + " bemutatóján Vilma párja " + tanc[i].név1 + " volt");
               partner+= 1;
            }
            
         }
         if (partner === 0) { 
            res.write("Vilma nem táncolt " + betanc + "-t");
         }
      }
      //6.feladat:

      const fiukneve = new Array<string>();
      const lanyokneve = new Array<string>();
      for (var index = 0; index < tanc.length; index++) {
         var element = tanc[index];
         if (fiukneve.indexOf(element.név2) === -1) fiukneve.push(element.név2);
         
      }
      for (var index = 0; index < tanc.length; index++) {
         var element = tanc[index];
         if (lanyokneve.indexOf(element.név1) === -1) lanyokneve.push(element.név1);

      }
      
      fs.writeFileSync("tancolok.txt", "Lányokneve: " + lanyokneve + "\nFiúkneve: " + fiukneve);
      
      res.write("<p>7.feladat:</p>")
      const fiuk: number[] = [];
      for (let i: number = 0; i < tanc.length; i++) {
         let db1: number = 0;
         for (let j: number = 0; j < tanc.length; j++) {
            if (tanc[i].név2 === tanc[j].név2){ db1++; }
         }
         fiuk.push(db1);
      }
      const lanyok: number[] = [];
      for (let i: number = 0; i < tanc.length; i++) {
         let db1: number = 0;
         for (let j: number = 0; j < tanc.length; j++) {
            if (tanc[i].név2 === tanc[j].név2){ db1++; }
         }
         lanyok.push(db1);
      }

      let szamlalo: number = 0;
      let nev: string = "";
      for (let j: number = 0; j < lanyok.length; j++) {
         if (lanyok[j] >= szamlalo) { szamlalo = lanyok[j]; nev = tanc[j].név1; }
      }
      res.write("<p>Legtöbbet szereplő lány neve: "+ nev +"</p>");
      szamlalo = 0;
      nev = "";
      for (let j: number = 0; j < lanyok.length; j++) {
         if (fiuk[j] >= szamlalo) { szamlalo = lanyok[j]; nev = tanc[j].név2; }
      }
      res.write("<p>Legtöbbet szereplő fiu neve: " + nev + "</p>");

      res.write("</p><input type='submit' value='Frissítés'></pre></form>");
      res.end();
   }
}