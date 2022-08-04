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
                    const sourceChar = Number(tl.substring(0,4));
                    const codePoint  = String.fromCharCode(Number(tl.substring(5,11)));
                    this._decodeMap.set(sourceChar, codePoint);
                    this._encodeMap.set(codePoint, sourceChar);
                }
            });
    }

    public decodeByte(b:number):string {
        return this._decodeMap.get(b);
    }

    public encodeChar(c:string):number {
        return this._encodeMap.get(c);
    }

    public encodeString(s:string):Uint8Array {
        const newArray = new Uint8Array(s.length);
        s.split("").map(c =>this._encodeMap.get(c))
                   .forEach((n,i) => newArray[i] = n);
        return newArray;
    }

    public decodeArray(a:Uint8Array):string {
        let outString:string = ""
        a.forEach((b,i) => outString = outString.concat(this._decodeMap.get(b)));
        return outString;
    }


    public get codesetName() { return this._codesetName; }
}