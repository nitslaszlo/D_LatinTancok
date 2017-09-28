import * as http from "http";
import { Content } from "./content";
import { Táncok } from "./Tancok";

class Program {
    constructor() {
        http.createServer(new Content().Content).listen(8080);
        
    }
}

new Program();