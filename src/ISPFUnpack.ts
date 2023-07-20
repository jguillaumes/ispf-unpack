import { Codeset } from "./Codeset";

export function ISPFUnpack(bytes:Uint8Array, codeset:string):string {
    const cs = new Codeset(codeset);
    const dv = new DataView(bytes.buffer);

    var outBlock:string = "";

    const firstByte = bytes[0]
    const formatId  = dv.getUint16(1, false);
    
    if (firstByte != 0 || formatId != 0x0140) {
        throw "The buffer does not contain a PACKED file"
    }
    
    const recfm = String.fromCharCode(bytes[3]);
    const lrecl = dv.getInt16(6, false);
    var line:string[] = [];
    var eol = false;
    var linelen:number = 0;
    var i = 8;
    var j = 0;

    while(i < bytes.length) {
        const eb = bytes[i++];

        if (eb === 0xff) break;                 // EOF
        if (eb === 0xfc || eb === 0x7c || eb === 0x7d ) {       // EOL  
            if (eb === 0xfc) {                  // Darrera 0xfc hi ha "ll" bytes de dades
                const ll = bytes[i++];          // Longitud del bloc - 1 (!!!)
                for (var k=0; i<=ll; k++) {
                    line[j++] = cs.decodeByte(bytes[i++]);
                }
            }
            if (eb === 0x7c ) linelen = bytes[i++]; // Saltar comptador a final de linia
            if (eb === 0x7d ) linelen = 256*bytes[i++] + bytes[i++];
                                                    // Comptador de dos bytesç
                                                    // Trobat per enginyeria inversa
                                                    // Igual que 0x7c per LRECL > 256
            eol = true;
        } else if (eb === 0x7a || eb === 0x7e) {    // Repeticions de caràcters
            const ll = bytes[i++];
            const ch = bytes[i++];
            for (var k=0; k<=ll; k++) {
                line[j++] = cs.decodeByte(ch);
            }
        } else if (eb === 0x78) {                  // Trobat per enginyera inversa
            const ll = bytes[i++];               // Sembla identic a 0x7a/0x7e assumint 
            for (var k=0; k<=ll; k++) {          // el caràcter a repetir == ' '
                line[j++] = ' ';
            }
            eol = true;
//            // log(`0x78: ${ll.toString(16)} / ${ll}`);
        } else if (eb >= 0x80) {                   // eb-80+1 bytes a continuació
            const ll = eb - 0x80;
            for (var k=0; k<=ll; k++) {
                line[j++] = cs.decodeByte(bytes[i++]);
            }
        } else {                                    // Bloc de blancs
            const ll = eb;
            for (var k=0; k<=ll; k++) {
                line[j++] = ' ';
            }
        }
        if (eol || j >= lrecl) {
            outBlock = outBlock.concat(line.slice(0,j).join("").trimEnd()).concat("\n");
            line = [];
            j = 0; 
            eol = false;
        }
    }
    return outBlock;
}