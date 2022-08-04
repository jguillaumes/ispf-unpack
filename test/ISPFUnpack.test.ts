import { log } from 'console';
import * as fs from 'fs';
import { ISPFUnpackFB} from '../src';

describe("Unpack", () => {

    const packFileName = `${__dirname}/data/AGSM001.pack`; 
    const b = fs.readFileSync(packFileName)
    const bb = new Uint8Array(b);
    const t = ISPFUnpackFB(bb, "ibm-1145", 133);
    log(t);


})