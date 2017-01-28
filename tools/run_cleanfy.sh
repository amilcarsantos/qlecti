#!/bin/bash

src='../src/Qlecti.dbg.js'
out_def='../dist/Qlecti.js'
out_min='../dist/Qlecti.min.js'

# 'debug' version to QML conventions
python javascript-cleanfy.py -q -f ${src} -o ${out_def} -c '{"skipLines":30, "tabToSpaces":4, "maxBlankLines":1}'

# 'debug' version to minimal version
python javascript-cleanfy.py -q -f ${src} -o ${out_min} -c '{"skipLines":29, "tabToSpaces":1, "maxBlankLines":0}'


