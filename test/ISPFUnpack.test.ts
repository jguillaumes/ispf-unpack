import { expect } from 'chai';
import { log } from 'console';
import * as fs from 'fs';
import { ISPFUnpackFB} from '../src';

describe("Unpack", () => {

    log("Testing ISPF UNPACK...")
    const packFileName = `${__dirname}/data/AGSM000.pack`; 
    const textFileName = `${__dirname}/data/AGSM000.txt`; 
    const b = fs.readFileSync(packFileName);
    const bb = new Uint8Array(b);
    const t = ISPFUnpackFB(bb, "ibm-1145");
    // fs.writeFileSync("out.txt", t);
    const unpacked_lines = t.split(/\r?\n/);

    const text = fs.readFileSync(textFileName).toString();
    const unpacked_text = text.split(/\r?\n/);

    expect(unpacked_lines).deep.equal(unpacked_text);
    log("ISPF UNPACK test passed!");

})