#!/usr/bin/python

'''
UNDER-CONSTRUCTION


Take either a file, or a directory containing
  javascript files, then send them to the
  closure javascript compiler.
'''

import sys, os, re
import json
from optparse import OptionParser

class CompileOptions(object):
  def __init__(self, skipLines="0", tabToSpaces="2", maxBlankLines="2", replace={}):
    self.skipLines = int(skipLines)
    self.tabToSpaces = int(tabToSpaces)
    self.maxBlankLines = int(maxBlankLines)
    self.replaceWords = dict(replace)
  '''
   tdb: remover skipLines, passar a usar operadores nos comentarios:
   /*! comentario a nao apagar */     //! comentario a nao apagar  
   // \if comentarion_condicional (tipo #ifdef) -> apaga se nao houver a flag ... fazer tipo 1boostrap customizer
   
  do doxygen
    /*! Unconditionally shown documentation.
     *  \if Cond1
     *    Only included if Cond1 is set.
     *  \endif
     *  \if Cond2
     *    Only included if Cond2 is set.
     *    \if Cond3
     *      Only included if Cond2 and Cond3 are set.
     *    \endif
     *    More text.
     *  \endif
     *  Unconditional text.
     */
  '''
  def __str__(self):
    return ('skipLines:' + `self.skipLines` +
            '; tabToSpaces:' + `self.tabToSpaces` +
            '; maxBlankLines:' + `self.maxBlankLines`)


class Line(object):
  def __init__(self, line):
    self.data = line.rstrip('\n')
    self.comment = False
    self.skip = False


  def update(self, newLine):
    self.data = newLine
    
  def __str__(self):
    return self.data



def compileJavascript(jsFile, compileOptions):
  source = []

  try:
    f = open(jsFile, 'r')
    for line in f:
      source.append(Line(line))

    f.close()
  except IOError:
    print "Unable to open {0}".format(jsFile)

  deleteComments(source, compileOptions)
  replaceTrailings(source, compileOptions)
  deleteBlankLines(source, compileOptions)
  replaceWords(source, compileOptions)
  
  jsData = ''
  for l in source:
    if not l.skip:
      jsData += str(l) + '\n'

  return jsData



def deleteComments(source, compileOptions):
  opened = False

  for line in source[compileOptions.skipLines:]:
    newLine, ini, commentedLine  = "", 0, False
    for c in [m.start() for m in re.finditer('/\*|//|\*/', line.data)]:
      if not opened and line.data[c:c+2] == "//":
        # if line.data[] == "// comando":  TDB line.command = line.data[c+2:]
        line.data = newLine + line.data[ini:c]
        line.comment, commentedLine = True, True
        break
      elif not opened and line.data[c:c+2] == "/*":
        newLine = newLine + line.data[ini:c]
        opened = True
      else:
        if line.data[c:c+2] == "*/":
          opened = False
          ini = c+2

    if not opened and not commentedLine:
      line.data = newLine + line.data[ini:]

    #if newLine != "":
   #   newSource.append(newLine)

  #return newSource

def replaceTrailings(source, compileOptions):
  tab2Space = ''
  if compileOptions.tabToSpaces < 0:
    return

  for i in range(compileOptions.tabToSpaces):
    tab2Space += ' '

  for line in source[compileOptions.skipLines:]:
    newLine = ""
    for c in range(len(line.data)):
      if line.data[c] == '\t':
        newLine += tab2Space
      else:
        newLine += line.data[c:].rstrip()
        break
    line.data = newLine


def deleteBlankLines(source, compileOptions):
  count = 0

  for line in source[compileOptions.skipLines:]:
    if line.data.rstrip() == '':
      if line.comment:
        # blank commented line
        line.skip = True
      else:
        count += 1
        if count > compileOptions.maxBlankLines:
          line.skip = True
    else:
      count = 0


def removeSpaces():
  # we don't need spaces around operators

  # TDB
  #   quote_chars="'\"" 
  #   in_quote = ''
  #   if in_quote:
  #     if next1 == in_quote:
  #       numslashes = 0
  #       if c != '\\':
  #         break
  #       else:
  #         numslashes += 1
  #       if numslashes % 2 == 0:
  #         in_quote = ''
  #     in_quote = next1
  #  symbols = '{(,=:[?!&|;' 
  return 1

def replaceWords(source, compileOptions):
  if not compileOptions.replaceWords:
    return

  for line in source[compileOptions.skipLines:]:
    if not line.comment and not line.skip and line.data != '':
      for patt in compileOptions.replaceWords:
        if patt in line.data:
          line.data = line.data.replace(patt, compileOptions.replaceWords[patt])
  return

def _main():
  '''
  Main
  '''

  # Set up some Opt flags
  parser = OptionParser()
  parser.add_option("-f", "--file", help="The javascript file to be compiled, or the directory containing the javascript files to be compiled.", action="store", type="string", dest="fileName")
  parser.add_option("-o", "--output", help="The compiled javascript file name.", action="store", type="string", dest="outFileName")
  parser.add_option("-w", "--whitespace-only", help="Specify compile type as WHITESPACE_ONLY (Default)", action="store_const", const="WHITESPACE_ONLY", dest="compileType")
  #parser.add_option("-s", "--simple-optimizations", help="Specify compile type as SIMPLE_OPTIMIZATIONS", action="store_const", const="SIMPLE_OPTIMIZATIONS", dest="compileType")
  #parser.add_option("-a", "--advanced-optimizations", help="Specify compile type as ADVANCED_OPTIMIZATIONS", action="store_const", const="ADVANCED_OPTIMIZATIONS", dest="compileType")
  parser.add_option("-c", "--compile-options", help="Specify compile type as SIMPLE_OPTIMIZATIONS", action="store", dest="compileType")
  parser.add_option("-p", "--print", help="Print output to STDOUT as opposed to a file.", action="store_true", dest="printOut")
  parser.add_option("-q", "--quiet", help="Supress non error messages. This means files will be overwritten without asking.", action="store_true", dest="quiet")
  (opts, args) = parser.parse_args()

  if opts.compileType is None:
    compileType = 'WHITESPACE_ONLY'
    compileOptions = CompileOptions()
  else:
    compileType = opts.compileType
    print compileType
    try:
      obj = json.loads(compileType)
      compileOptions = CompileOptions(**obj)
      print compileOptions
    except ValueError, e:
      sys.exit(0)
      

  # Check if we're given a file or directory
  if os.path.isfile(opts.fileName):
    jsFile = opts.fileName
    if '.min.js' in jsFile:
      print "This seems to already be minified?"
      sys.exit(0)
    
    if opts.outFileName is None:
      minFile = os.path.splitext(jsFile)[0] + '.min.js'
    else:
      minFile = opts.outFileName
      if not '.js' in minFile:
        minFile += '.js'

    # Don't bother to compile the javascript if we arent' overwriting an existing file.
    if os.path.exists(minFile) and not opts.quiet and not opts.printOut:
      while True:
        overwrite = raw_input("\nWARNING: {0} exits! Overwrite? [y|n] ".format(minFile))
        if overwrite == "yes" or overwrite == "y":
          print "Overwriting.\n"
          break
        elif overwrite == "no" or overwrite == "n":
          print "Exiting."
          sys.exit(0)
        else:
          print "Please enter yes or no."
    
    if not opts.quiet:
        print "Compiling {0}...".format(jsFile)
    minJs = compileJavascript(jsFile, compileOptions)

    if opts.printOut:
      print minJs
    else:
      try:
        f = open(minFile, 'w')
        f.write(minJs)
        f.close()
      except IOError:
        print "Unable to write min file for {0}".format(jsFile)
  
  elif os.path.isdir(opts.fileName):
    # TBD: still valid ?
    jsPath = opts.fileName
    jsFiles = os.listdir(jsPath)

    for script in jsFiles:
      # Don't re-min a min.
      if '.min.js' in script:
        continue

      minFile = jsPath + '/' + os.path.splitext(script)[0] + '.min.js'

      # Don't bother to compile the javascript if we arent' overwriting an existing file.
      if os.path.exists(minFile) and not opts.quiet and not opts.printOut:
        continueOuterLoop = False
        while True:
          overwrite = raw_input("\nWARNING: {0} exits! Overwrite? [y|n] ".format(minFile))
          if overwrite == "yes" or overwrite == "y":
            print "Overwriting.\n"
            break
          elif overwrite == "no" or overwrite == "n":
            print "Continuing to next"
            continueOuterLoop = True
            break
          else:
            print "Please enter yes or no."
      
      if continueOuterLoop:
        continueOuterLoop = False
        continue

      if not opts.quiet:
        print "Compiling {0}...".format(script)
      minJs = compileJavascript(jsPath + '/' + script, compileType)

      if opts.printOut:
        print minJs
      else:
        try:
          f = open(jsPath + '/' + os.path.splitext(script)[0] + '.min.js', 'w')
          f.write(minJs)
          f.close()
        except IOError:
          print "Unable to write min file for {0}".format(jsFile)
  else:
    print "A file must be supplied."

  if not opts.quiet:
    print "\nDone!\n"
##  sys.exit(0)

if __name__ == "__main__":
  _main()
