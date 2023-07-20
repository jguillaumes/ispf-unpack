import * as fs from 'fs';

export class Codeset {
    private _encodeMap:Map<string, number> = new Map<string,number>();
    private _decodeMap:Map<number, string> = new Map<number,string>();
    private _codesetName:string; 

    constructor(codesetName:string) {
        this._codesetName = codesetName;
        const tableFile = `${__dirname}/../tables/${codesetName}.txt`;
        fs.readFileSync(tableFile)
            .toString("utf-8")
            .split(/\r?\n/)
            .forEach(l=>{
                const tl = l.trim();
                if (tl.charAt(0) !== "#") {
                    const entries = tl.split("\t");
                    const sourceChar = Number(entries[0]);
                    const codePoint  = String.fromCharCode(Number(entries[1]));
                    this._decodeMap.set(sourceChar, codePoint);
                    this._encodeMap.set(codePoint, sourceChar);
                }
            });
    }

    public decodeByte(b:number):string {
        return this._decodeMap.get(b) as string;
    }

    public encodeChar(c:string):number {
        return this._encodeMap.get(c) as number;
    }

    public encodeString(s:string):Uint8Array {
        const newArray = new Uint8Array(s.length);
        s.split("").map(c =>this._encodeMap.get(c))
                   .forEach((n,i) => newArray[i] = n as number);
        return newArray;
    }

    public decodeArray(a:Uint8Array):string {
        let outString:string = ""
        a.forEach((b,i) => outString = outString.concat(this._decodeMap.get(b) as string));
        return outString;
    }


    public get codesetName() { return this._codesetName; }
}