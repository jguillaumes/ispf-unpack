import { Codeset } from "./Codeset";

export function ISPFUnpackFB(bytes:Uint8Array, codeset:string, lrecl:number) {
    const cs = new Codeset(codeset);

    var outBlock:string = "";
    var i:number = 8;

    while(i < bytes.length) {
        const eb = bytes[i++];

        if (eb === 0xff) break;                 // EOF
        if (eb === 0xfc || eb === 0x7c) {       // EOL  
            if (eb === 0xfc) {                  // Darrera 0xfc hi ha "ll" bytes de dades
                const ll = bytes[i++];          // Longitud del bloc - 1 (!!!)
                for (var k=0; i<=ll; k++) {
                    outBlock = outBlock.concat(cs.decodeByte(bytes[i++]));
                }
            }
            if (eb === 0x7c) i++;                   // Saltar comptador a final de linia
            outBlock = outBlock.concat("\n");
        } else if (eb === 0x7a || eb === 0x7e) {    // Repeticions de caràcters
            const ll = bytes[i++];
            const ch = bytes[i++];
            outBlock = outBlock.concat(cs.decodeByte(ch).repeat(ll+1));

        } else if (eb >= 0x80) {                   // eb-80+1 bytes a continuació
            const ll = eb - 0x80;
            for (var k=0; k<=ll; k++) {
                outBlock = outBlock.concat(cs.decodeByte(bytes[i++]));
            }
        } else {                                    // Bloc de blancs
            const ll = eb;
            outBlock = outBlock.concat(" ".repeat(ll+1));
        }
    }
    const numLines = outBlock.length / lrecl + 1;
    var outString:string = "";
    for (var i=0; i<numLines; i++){
        outString = outString.concat(outBlock.substring(i*lrecl, (i+1)*lrecl+1)).concat("\n");
    }

    return outString;
}