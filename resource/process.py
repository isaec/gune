from progress.bar import IncrementalBar as Bar
import json


#read file to memory
with open("danteInferno.txt", "r") as file:
    filedata = file.readlines()


#make and write changes to new file
with open("dante.txt", "w") as file:
    lineBuffer = ""
    for line in filedata:
        #don't write non sentance lines
        if "Inferno:" in line or line == "\n": continue
        if line[:2] == "  ":
            lineBuffer += line[2:]
        else:
            file.write(lineBuffer+"\n")
            lineBuffer = line
