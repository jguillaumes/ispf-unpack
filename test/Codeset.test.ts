import { expect } from 'chai';
import { log } from 'console';
import { Codeset } from '../src';

describe('ibm-1145', () => {
    log("Testing codeset IBM-1145...");
    const cs = new Codeset("ibm-1145");
    const initString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÑÇ#";
    const expectedEbcdic = new Uint8Array([
        240, 241, 242, 243, 244, 245, 246,
        247, 248, 249, 193, 194, 195, 196,
        197, 198, 199, 200, 201, 209, 210,
        211, 212, 213, 214, 215, 216, 217,
        226, 227, 228, 229, 230, 231, 232,
        233, 123, 104, 105
      ]);

    const ebcdic = cs.encodeString(initString);
    // log(ebcdic);
    expect(ebcdic).to.deep.equal(expectedEbcdic);

    const backToString = cs.decodeArray(ebcdic);
    // log(backToString);
    expect(backToString).equal(initString);
    log("Codeset IBM-1145 test passed!");
}) 

describe('ibm-1047', () => {
    log("Testing codeset IBM-1047...");
    const cs = new Codeset("ibm-1047");
    const initString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÑÇ#";
    const expectedEbcdic = new Uint8Array([
        240, 241, 242, 243, 244, 245, 246,
        247, 248, 249, 193, 194, 195, 196,
        197, 198, 199, 200, 201, 209, 210,
        211, 212, 213, 214, 215, 216, 217,
        226, 227, 228, 229, 230, 231, 232,
        233, 105, 104, 123
      ]);

    const ebcdic = cs.encodeString(initString);
    // log(ebcdic);
    expect(ebcdic).to.deep.equal(expectedEbcdic);
    // ebcdic.forEach(n => log(n.toString(16)));

    const backToString = cs.decodeArray(ebcdic);
    // log(backToString);
    expect(backToString).equal(initString);
    log("Codeset IBM-1047 test passed!");
}) 

describe('Multiline 1145', () => {
    log("Testing multiline conversion...")
    const cs = new Codeset("ibm-1145");
    const initString = "First line\nSecond line";
    const expectedEbcdic = new Uint8Array([
        198,137,153,162,163,64,147,137,149,
        133,37,226,133,131,150,149,132,64,
        147,137,149,132
    ]);
    // log(`initial string :\n ${initString}`);

    const ebcdic = cs.encodeString(initString);
    // log(`ebcdic array:\n ${ebcdic}`);
    expect(ebcdic).deep.equal(expectedEbcdic);

    const backString = cs.decodeArray(ebcdic);
    // log(`back string :\n ${backString}`);
    expect(backString).equal(initString);
    log("Multiline conversion test passed!")
})