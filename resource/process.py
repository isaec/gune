import spacy
from progress.bar import IncrementalBar as Bar

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
        if "Inferno:" in line or line == "\n":
            bar.next()
            continue
        line = line.replace("  ", "").replace('"',"")
        #doc = nlp(line)
        
        file.write(line)
        bar.next()
print("\ndone!")