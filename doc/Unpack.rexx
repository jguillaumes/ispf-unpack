/* Rexx - Unpack */ 
/* This program unpacks ISPF Packed Files. These should 
   have been downloaded as binary, so they will be in EBCDIC.*/ 
arg FileIn . 
Parse var FileIn Filename '.' .     /* drop trailing extension */ 
FileOut = FileName'.unpacked' 

AsciiNum = '272030313233343536373839'x      /* start with quote space */ 
AsciiUpp = '4142434445464748494A4B4C4D4E4F505152535455565758595A'x 
AsciiLow = '6162636465666768696A6B6C6D6E6F707172737475767778797A'x 
AsciiSpecial =  '2f2c2d2e3a3b28292a2b213d'x /* /,-.:;()*+|= */ 

EbcdicNUM = '7d40f0f1f2f3f4f5f6f7f8f9'x     /* start with quote space */ 
EbcdicUpp = 'c1c2c3c4c5c6c7c8c9d1d2d3d4d5d6d7d8d9e2e3e4e5e6e7e8e9'x 
EbcdicLow = '818283848586878889919293949596979899a2a3a4a5a6a7a8a9'x 
EbcdicSpecial = '616b604b7a5e4d5d5c4e4f7e'x 

Ascii  = AsciiNum  || AsciiUpp  || AsciiLow  || AsciiSpecial 
Ebcdic = EbcdicNum || EbcdicUpp || EbcdicLow || EbcdicSpecial 

   /* 
    |  ISO 8859-1 to CECP 1047 (Extended de-facto EBCDIC): 
    */ 

   ebcdic =           '00010203372D2E2F1605250B0C0D0E0F'x      /* 00 */ 
   ebcdic = ebcdic || '101112133C3D322618193F271C1D1E1F'x      /* 10 */ 
   ebcdic = ebcdic || '405A7F7B5B6C507D4D5D5C4E6B604B61'x      /* 20 */ 
   ebcdic = ebcdic || 'F0F1F2F3F4F5F6F7F8F97A5E4C7E6E6F'x      /* 30 */ 
   ebcdic = ebcdic || '7CC1C2C3C4C5C6C7C8C9D1D2D3D4D5D6'x      /* 40 */ 
   ebcdic = ebcdic || 'D7D8D9E2E3E4E5E6E7E8E9ADE0BD5F6D'x      /* 50 */ 
   ebcdic = ebcdic || '79818283848586878889919293949596'x      /* 60 */ 
   ebcdic = ebcdic || '979899A2A3A4A5A6A7A8A9C04FD0A107'x      /* 70 */ 
   ebcdic = ebcdic || '202122232415061728292A2B2C090A1B'x      /* 80 */ 
   ebcdic = ebcdic || '30311A333435360838393A3B04143EFF'x      /* 90 */ 
   ebcdic = ebcdic || '41AA4AB19FB26AB5BBB49A8AB0CAAFBC'x      /* A0 */ 
   ebcdic = ebcdic || '908FEAFABEA0B6B39DDA9B8BB7B8B9AB'x      /* B0 */ 
   ebcdic = ebcdic || '6465626663679E687471727378757677'x      /* C0 */ 
   ebcdic = ebcdic || 'AC69EDEEEBEFECBF80FDFEFBFCBAAE59'x      /* D0 */ 
   ebcdic = ebcdic || '4445424643479C485451525358555657'x      /* E0 */ 
   ebcdic = ebcdic || '8C49CDCECBCFCCE170DDDEDBDC8D8EDF'x      /* F0 */ 

   /* 
    | Hex table to aid in translating all 8-bit characters 
    */ 

   ascii =          '000102030405060708090A0B0C0D0E0F'x         /* 00 */ 
   ascii = ascii || '101112131415161718191A1B1C1D1E1F'x         /* 10 */ 
   ascii = ascii || '202122232425262728292A2B2C2D2E2F'x         /* 20 */ 
   ascii = ascii || '303132333435363738393A3B3C3D3E3F'x         /* 30 */ 
   ascii = ascii || '404142434445464748494A4B4C4D4E4F'x         /* 40 */ 
   ascii = ascii || '505152535455565758595A5B5C5D5E5F'x         /* 50 */ 
   ascii = ascii || '606162636465666768696A6B6C6D6E6F'x         /* 60 */ 
   ascii = ascii || '707172737475767778797A7B7C7D7E7F'x         /* 70 */ 
   ascii = ascii || '808182838485868788898A8B8C8D8E8F'x         /* 80 */ 
   ascii = ascii || '909192939495969798999A9B9C9D9E9F'x         /* 90 */ 
   ascii = ascii || 'A0A1A2A3A4A5A6A7A8A9AAABACADAEAF'x         /* A0 */ 
   ascii = ascii || 'B0B1B2B3B4B5B6B7B8B9BABBBCBDBEBF'x         /* B0 */ 
   ascii = ascii || 'C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF'x         /* C0 */ 
   ascii = ascii || 'D0D1D2D3D4D5D6D7D8D9DADBDCDDDEDF'x         /* D0 */ 
   ascii = ascii || 'E0E1E2E3E4E5E6E7E8E9EAEBECEDEEEF'x         /* E0 */ 
   ascii = ascii || 'F0F1F2F3F4F5F6F7F8F9FAFBFCFDFEFF'x         /* F0 */ 
   ascii = xrange() 

signal on notready 

x = charin(FileIn,2,2)               /* read 1st 2 chars */ 
if x \= '0140'x then 
  do 
    say FileIn 'does not contain the identifier 0140 - instead' c2x(x) 
    say 'Length of data' length(x) 
    exit 12 
  end 

/* start reading our way through the beast */ 
x = charin(FileIn,9,1)                    /* go to start of data */ 
y = ''                                     /* y is output line */ 
do forever 
  select 
    when x = 'ff'x then exit 

    when x >= '80'x then 
      do                   /* data following */ 
        Datalen = c2d(x) - 127 
        x = charin(FileIn,,DataLen) 
        y = y || translate(x,Ascii,Ebcdic) 
        x = charin(FileIn) 
      end 

    when x = '7C'x then 
      do 
        rc = LineOut(FileOut,y) 
        y = '' 
        x = charin(FileIn)   /* skip this byte - record length */ 
        x = charin(FileIn)   /* get next field length byte */ 
      end 

 /* 7e = 7a, but at the end of a maximum length logical record */ 
    when x = '7a'x |,       /* process repetition character */ 
         x = '7e'x then     /* process repetition character */ 
      do 
        DataLen = c2d(charin(FileIn)) + 1 
        RepChar = charin(FileIn) 
        y = y || left('',DataLen,translate(RepChar,Ascii,Ebcdic)) 
        x = charin(FileIn)           /* Get next field length */ 
      end 

    otherwise                /* spaces indicator */ 
      do 
        NumSpaces = c2d(x) + 1 
        y = y || left(' ',NumSpaces,' ') 
        x = charin(FileIn)             /* Get next field length */ 
      end 
    end 
  end 

notready: 
exit 
/* 
00 01 40 E5 00 00 00 50 

7E    Rep char 
4F    79 (+1) 
81    'a' 

4E    78 (+1) spaces 
FC    EOR Rep char 
00    0 (+1) 
82    'b' 

4A    74 (+1) spaces 
7E    Rep char 
04    4 (+1) 
83    'c' 

7A    Rep char 
1F    31 (+1) 
84    'd' 
7C    Rep char 
2F    47 (+1) 

80    128 - 127 
F0    '0' 
7C    Rep char 
4E    78 (+1) 

80    128 (- 127) 
F1    '1' 
7C    Rep char 
4E    78 (+1) 

99    153 (- 127) 
81    'a' 
82    'b' 
. 
. 
a8    'y' 
a9    'z' 

7c    Rep char 
35    53 (+1) 

FF    eof 
*/ 
/* 
80a @ 1, 1b @ 80, 5c @ 76, 32d @ 1 
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa 


dddddddddddddddddddddddddddddddd 
0 
1 
abcdefghijklmnopqrstuvwxyz 
*/ 
/* 
http://m v s h e l p.net/vbforums/showthread.php? 
t=19766&highlight=translate+packed 

I don't have any doc on the format, but it is a run length encoding 
scheme. In theory, the byte that gets compressed out is variable and 
is in the header, but in practice it is limited to spaces (x'40') in 
the ISPF implementation. The CMS pack format used to be documented and 
ISPF uses pretty much the same one except that there is modification 
because CMS always stored packed data in 1024 byte records and ISPF 
didn't have that luxury. There was an apar back in Version 2 days 
(1985?) that modified the format slightly to deal with reblocking 
during copies and I suspect that that is where the fluff you mentioned 
comes from. I couldn't find the apars though, but I remember it was a 
nightmare of an apar (1 for DM, 1 for PDF). If you can get a hold of 
any ancient CMS publications, you may find the algorithm mostly there. 
=== 
Well, I finally figured out what is going on, so here is the format of 
ISPF Packed Data: 

The first 4 bytes are, I think, a packed-format indicator 
(X'000140E5'). Then there are three bytes of filler, and then a 1 byte 
record length. After this, it starts getting interesting... 

As nadel said, it is run-length encoded. The first byte in the string 
is either a length field, or the special chars x'7C' or x'7A'. 

7C is an endline indicator, and is followed by another 1 byte record 
length. 

7A is a repetition indicator - it will be followed by a length byte, 
and then the repetition character. 

All other fields are length indicators - if they are greater than or 
equal to x'80' then they indicate length-x'80' bytes of data 
following. If they are less than x'80' then they indicate that number 
of spaces should be inserted. 

To round it all off, all lengths are m.l., so they need to be 
incremented by one if used in Rexx. 
=== 
<BLOCKQUOTE>The first 4 bytes are, I think, a packed-format indicator 
(X'000140E5')</BLOCKQUOTE> FYI, the fourth byte is the RECFM - in your 
case the letter 'V' ( x'E5' ) for Variable. It could also be a 'F' 
( x'C6' ) if the data is Fixed-Length. If the data is Fixed-length, no 
endline indicators ( x'7C' ) will be present in the packed data, as the 
end point of each record is fixed. It does appear that trailing spaces 
in one record followed by leading spaces in the next are compressed 
separately and not 'wrapped'. 
=== 
The header actually contains 8 bytes -- 

X'000140',CL1'F or V',FL4'lrecl' 

My personal guess is that true indicator is the first X'00'. The X'01' 
may be the number of filler characters, and the X'40' is the first 
(of 1) filler characters. 

For example -- 

and 

The first 8 bytes in the second example are the BDW and the first RDW 
for a variable record data set. 

If the unpacked source file contains variable length records, the 
packed file also contains variable length records. Regardless of 
record format, the recorded data "streams" over logical record 
boundaries. 
=== 
Another special character -- X'FF' = end of data 
=== 
Two more comments -- 

- X'7C' (end of line for V format records). I am unable to deduce the 
meaning of contents of the byte following the string definition. 

- In the event a variable length line completely fills the LRECL, 
there is no end of line indicator. 
=== 
The following is the core part of a routine to expand ISPF packed 
format. 

In addition to previous notes -- 

X'FC' is a header followed by a text length-1 without the X'80' and 
text. It seems to be mostly used at or near the end of a VB line. 

If the actual line length is 1 less than the LRECL of a variable 
length record, SPF adds a blank to the line. I retain the excess blank 
in my output. 

Code notes -- 

GETREC returns the first text byte in R7, the record length in R8, 
and the last text byte in R9. It returns to +4 if not an EOF, to +0 if 
an EOF. 

PUTREC writes a logical record, 1st text byte in R0, the LRECL in R1 

Not all the paths have been fully checked yet. 
=== 
I've found another key -- X'7E. Same as X'7A', but at the end of a 
maximum length logical record. 

I have nearly completed a utility to transform a data set to its SPF 
packed format. I have also updated the EXPAND utility to process the 
new key I found, but it has not yet been tested. 
*/