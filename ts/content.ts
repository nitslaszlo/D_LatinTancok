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
      
      res.write("</p><input type='submit' value='Frissítés'></pre></form>");
      res.end();
   }
}


/*export class Content {

   Content(req: http.ServerRequest, res: http.ServerResponse): void {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<form style='font-size:16px; background: LightGray'>");
      res.write("<pre style='font-family: Courier'>");
      res.write("<p>1. feladat: Az adatok beolvasása</p>");

      const query: any = url.parse(req.url, true).query; // user input
      const vazon: string = query.vazon === undefined ? "AB123" : query.vazon;
      const sorszam: string = query.sorszam === undefined ? "10" : query.sorszam;

      const v: Versenyző[] = [];
      const sorok: string[] = fs.readFileSync("valaszok.txt").toString().split("\r\n");
      Versenyző.helyesMegoldás = sorok[0];
      for (let i: number = 1; i < sorok.length; i++) {
         if (sorok[i].length > 0) v.push(new Versenyző(sorok[i]));
      }

      res.write(`<p>2. feladat: A vetélkedőn ${v.length} versenyző indult.</p>`);

      res.write("<p>3. feladat: A versenyző azonosítója = <input type='text' " +
         "name= 'vazon' style= 'font-family:Courier; font - size: inherit; " +
         "background:LightGray;' value='" + vazon + "'><br>");

      let tmp: Versenyző;
      for (let i: number = 0; i < v.length; i++) {
         if (v[i].vk === vazon) { tmp = v[i]; break; }
      }

      // ha nincs a megadott versenyző, kilép:
      if (tmp === undefined) { res.end(); return; }
      res.write(`${tmp.vv} (a versenyző válasza)</p>`);

      res.write("<p>4. feladat:<br>");
      res.write(Versenyző.helyesMegoldás + " (a helyes megoldás)<br>");
      res.write(tmp.VálaszMinta() + " (a versenyző helyes válaszai)</p>");

      // ha a "sorszam" paraméter nem szám, akkor kilép:
      if (parseInt(sorszam) === undefined) { res.end(); return; }

      res.write("<p>5. feladat: A feladat sorszáma = " +
         "<input type='text' name='sorszam' style='font-family:Courier; " +
         "font - size: inherit; background:LightGray; ' value=" +
         `'${sorszam}'><br>`);
      let dbHelyes: number = 0;
      v.forEach((i) => { if (i.HelyesenVálaszolt(parseInt(sorszam) - 1)) dbHelyes++; });
      res.write(`A feladatra ${dbHelyes} fő, a versenyzők ` +
         (dbHelyes / v.length * 100).toFixed(2) + "%-a adott helyes választ.</p>");

      res.write("<p>6. feladat: A versenyzők pontszámának meghatározása</p>");
      const ws: fs.WriteStream = fs.createWriteStream("pontok.txt");
      v.forEach((i) => { ws.write(`${i.vk} ${i.Pontszám()}\r\n`); });
      ws.end();

      res.write("<p>7. feladat:  A verseny legjobbjai:<br>");
      v.sort((a, b) => { return b.Pontszám() - a.Pontszám(); });
      let díj: number = 0;
      let pontElőző: number = -1;
      for (let i: number = 0; i < v.length; i++) {
         if (pontElőző !== v[i].Pontszám()) {
            díj++;
            if (díj === 4) break;
         }
         res.write(`${díj}.díj (${v[i].Pontszám()} pont): ${v[i].vk}<br>`);
         pontElőző = v[i].Pontszám();
      }
      res.write("</p><input type='submit' value='Frissítés'></pre></form>");
      res.end();
   }
}
*/