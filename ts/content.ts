export class Content {

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


/*
class Tanciskola {
   static void Main()
        {
   List < Tánc > t = new List<Tánc>();
   using(StreamReader sr = new StreamReader("tancrend.txt")) { while (!sr.EndOfStream) t.Add(new Tánc(sr.ReadLine(), sr.ReadLine(), sr.ReadLine())); }

   Console.WriteLine("2. feladat: Első tánc a(z) {0}, az utolsó a(z) {1} volt.", t[0].T, t.Last().T);

   Console.WriteLine("3. feladat: {0} pár mutatott be szambát.", t.Count(x => x.T == "samba"));

   Console.WriteLine("4. feladat: Vilma a következő táncokban szerepelt: {0}", t.Where(x => x.L == "Vilma").Aggregate("", (c, n) => c += n.T + " "));

   Console.Write("5. feladat: Kérem a tánc nevét: ");
   string tánc = Console.ReadLine();
   var s = t.Where(x => x.L == "Vilma" & x.T == tánc);
   Console.WriteLine(s.Count() == 1 ? string.Format("\tA {0} bemutatóján Vilma párja {1} volt.", tánc, s.First().F) : String.Format("\tVilma nem táncolt {0}-t", tánc));

   List < string > ki = new List<string>();
   ki.Add(t.GroupBy(g => g.L).Aggregate("Lányok: ", (c, n) => c += n.Key + ", ").TrimEnd(", ".ToCharArray()));
   ki.Add(t.GroupBy(g => g.F).Aggregate("Fiúk: ", (c, n) => c += n.Key + ", ").TrimEnd(", ".ToCharArray()));
   File.WriteAllLines("szereplok.txt", ki);

   Console.WriteLine("7. feladat: Legtöbbször szereplő táncosok");
   Console.WriteLine(t.GroupBy(g => g.F).Where(x => x.Count() == t.GroupBy(g => g.F).Max(y => y.Count())).Aggregate("\tFiu(k):", (c, n) => c += " " + n.Key));
   Console.WriteLine(t.GroupBy(g => g.L).Where(x => x.Count() == t.GroupBy(g => g.F).Max(y => y.Count())).Aggregate("\tLányo(k):", (c, n) => c += " " + n.Key));

   Console.ReadKey();
}
    }
    */