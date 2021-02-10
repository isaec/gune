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

#make and write changes to new file
with open("dante.txt", "w") as file:
    for line in filedata:
        #don't write non sentance lines
        if "Inferno:" in line or line == "\n":
            bar.next()
            continue
        #remove indentation and quotations
        line = line.replace("  ", "").replace('"',"")
        doc = nlp(line)

        pos = [tok.pos_ for tok in doc]

        #don't write a sentance that lacks a noun or verb
        if "VERB" not in pos or "NOUN" not in pos:
            bar.next()
            continue
        
        file.write(line)
        #print a few lines as we go
        #if(random.randint(0,600) == 600): print("\n"+line)
        bar.next()
print("\ndone!")

