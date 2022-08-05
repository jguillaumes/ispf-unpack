# ispf-unpack: Unpack and convert ISPF text files and members

This package provides the following:

- A class (`Codeset`) which allows to convertjavascript strings to and from byte arrays in an a different codeset.
- A function (`ISPFUnpack`) which takes a byte array containing ISPF PACKED text and converts it into a javascript string, with lines separated by the local OS line terminators.

## Supported codesets

The distributed version of this package supports the following codesets:

- `ibm-284`: IBM EBCDIC SPAIN/LATAM without Euro Sign.
- `ibm-1145`: IBM EBCDIC SPAIN/LATAM with Euro Sign.
- `ibm-1047`: IBM EBCDIC Latin set.
- `iso-8859-1`: ISO Latin-1 without Euro sign.
- `iso-8859-15`: ISO Latin-1 with Euro sign.

## API reference

### Codeset conversion

```
import { Codeset } from 'ispf-unpack';

// Instantiate the converter:
const converter = new Codeset('ibm-1047');

// Encode a string in EBCDIC (1047)
const ebcdicText:Uint8Array = converter.encodeString("this is a string");

// Convert an array to a string
const jsString:string = converter.decodeArray(encdicText);

// Encode a single character
const charCode:number = converter.encodeChar("a");

// Decode a single byte
const theChar:string = converter.decodeChar(charCode);

```

### ISPF Unpacking

```
import { ISPFUnpack } from 'ispf-unpack';

// Convert a byte array containing PACKED text
const theText = ISPFUnpack(thBytes, 'ibm-1145');

```

## Adding more codesets

The supported codesets are determined by the text conversion tables found in the package `./tables` directory. Those tables have the name **`codeset`**.txt, and are generated using the **CodecMapper** utility, that can be found in [https://github.com/roskakori/CodecMapper](https://github.com/roskakori/CodecMapper). If you want to add more codesets, just generate them with CodecMapper and add the corresponding files to the specified directory.

