using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace Erettsegi29_LatinTáncok
{
    class Tánc
    {
        public string T { get; private set; }
        public string L { get; private set; }
        public string F { get; private set; }

        public Tánc(string t, string l, string f)
        {
            T = t;
            L = l;
            F = f;
        }


    }
    class Tanciskola
    {
        static void Main()
        {
            List<Tánc> t = new List<Tánc>();
            using (StreamReader sr = new StreamReader("tancrend.txt")) { while (!sr.EndOfStream) t.Add(new Tánc(sr.ReadLine(), sr.ReadLine(), sr.ReadLine())); }

            Console.WriteLine("2. feladat: Első tánc a(z) {0}, az utolsó a(z) {1} volt.", t[0].T, t.Last().T);

            Console.WriteLine("3. feladat: {0} pár mutatott be szambát.", t.Count(x => x.T == "samba"));

            Console.WriteLine("4. feladat: Vilma a következő táncokban szerepelt: {0}", t.Where(x => x.L == "Vilma").Aggregate("", (c, n) => c += n.T + " "));

            Console.Write("5. feladat: Kérem a tánc nevét: ");
            string tánc = Console.ReadLine();
            var s = t.Where(x => x.L == "Vilma" & x.T == tánc);
            Console.WriteLine(s.Count() == 1 ? string.Format("\tA {0} bemutatóján Vilma párja {1} volt.", tánc, s.First().F) : String.Format("\tVilma nem táncolt {0}-t", tánc));

            List<string> ki = new List<string>();
            ki.Add(t.GroupBy(g => g.L).Aggregate("Lányok: ", (c, n) => c += n.Key + ", ").TrimEnd(", ".ToCharArray()));
            ki.Add(t.GroupBy(g => g.F).Aggregate("Fiúk: ", (c, n) => c += n.Key + ", ").TrimEnd(", ".ToCharArray()));
            File.WriteAllLines("szereplok.txt", ki);

            Console.WriteLine("7. feladat: Legtöbbször szereplő táncosok");
            Console.WriteLine(t.GroupBy(g => g.F).Where(x => x.Count() == t.GroupBy(g => g.F).Max(y=>y.Count())).Aggregate("\tFiu(k):", (c, n) => c += " " + n.Key));
            Console.WriteLine(t.GroupBy(g => g.L).Where(x => x.Count() == t.GroupBy(g => g.F).Max(y=>y.Count())).Aggregate("\tLányo(k):", (c, n) => c += " " + n.Key));

            Console.ReadKey();
        }
    }
}
