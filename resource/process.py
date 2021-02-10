from progress.bar import IncrementalBar as Bar
import json


# read file to memory
with open("danteInferno.txt", "r") as file:
    filedata = file.readlines()


# make and write changes to new file
with open("dante.txt", "w") as file:
    lineBuffer = ""
    for line in filedata:
        # don't write non sentance lines
        if "Inferno:" in line or line == "\n":
            continue
        # figure out if the sentance is part of a larger block
        if line[:2] == "  ":
            lineBuffer += line[2:]
        else:
            #buffer is done
            # make sure not to have space at start
            if lineBuffer[:1] == " ":
                lineBuffer = lineBuffer[1:]


            file.write(lineBuffer+"\n")
            lineBuffer = line
