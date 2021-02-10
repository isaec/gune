from os import remove
import spacy
from progress.bar import IncrementalBar as Bar
import random

#load toknnization stuffs
print("loading token stuff")
nlp = spacy.load("en_core_web_sm")
print("token stuff loaded")

#read file to memory
with open("danteInferno.txt", "r") as file:
    filedata = file.readlines()

bar = Bar('processing lines', max=len(filedata))

first = True
#make and write changes to new file
with open("dante.txt", "w") as file:
    for line in filedata:
        #don't write non sentance lines
        if "Inferno:" in line or line == "\n":
            bar.next()
            continue
        #remove indentation, quotation, and line break
        line = line.replace("  ", "").replace('"',"")[:-1]
        doc = nlp(line)

        pos = [tok.pos_ for tok in doc]

        #don't write a sentance that lacks a noun or verb
        if "VERB" not in pos or "NOUN" not in pos:
            bar.next()
            continue

        #remove single quote at end of line
        if line[-1] == "'": line = line[:-1]

        #remove ending punctuation that looks bad
        if line[-1] in [";",",","."]: 
            line = line[:-1]
        
        if first:
            file.write(line)
            first = False
        else:
            file.write("\n"+line)
        
        #print a few lines as we go
        if(random.randint(0,600) == 600): print("\n"+line+"\n")
        bar.next()
print("\ndone!")

