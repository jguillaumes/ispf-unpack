import { expect } from 'chai';
import { log } from 'console';
import * as fs from 'fs';
import "../src/ISPFUnpack"
import { ISPFUnpack } from '../src/ISPFUnpack';

describe("Unpack FB", () => {

    log("Testing ISPF UNPACK for a FB file ...")
    const packFileName = `${__dirname}/data/AGSM000.pack`; 
    const textFileName = `${__dirname}/data/AGSM000.txt`; 
    const b = fs.readFileSync(packFileName);
    const bb = new Uint8Array(b);
    const t = ISPFUnpack(bb, "ibm-1145");
    // fs.writeFileSync("out.txt", t);
    const unpacked_lines = t.split(/\r?\n/);

    const text = fs.readFileSync(textFileName).toString();
    const unpacked_text = text.split(/\r?\n/);

    expect(unpacked_lines).deep.equal(unpacked_text);
    log("ISPF UNPACK test passed!");

})

describe("Unpack VB", () => {

    log("Testing ISPF UNPACK for a VB file ...")
    const packFileName = `${__dirname}/data/AGSM000vb.pack`; 
    const textFileName = `${__dirname}/data/AGSM000.txt`; 
    const b = fs.readFileSync(packFileName);
    const bb = new Uint8Array(b);
    const t = ISPFUnpack(bb, "ibm-1145");
    // fs.writeFileSync("out.txt", t);
    const unpacked_lines = t.split(/\r?\n/);

    const text = fs.readFileSync(textFileName).toString();
    const unpacked_text = text.split(/\r?\n/);

    expect(unpacked_lines).deep.equal(unpacked_text);
    log("ISPF UNPACK test passed!");

})