from progress.bar import IncrementalBar as Bar
import json


# read file to memory
with open("danteInferno.txt", "r") as file:
    filedata = file.readlines()

# make the changes
lineBuffer = ""
lineList = []
for line in filedata:
    # don't write non sentance lines
    if "Inferno:" in line or line == "\n":
        continue
    # figure out if the sentance is part of a larger block
    if line[:2] == "  ":
        lineBuffer += line[2:]
    else:
        # buffer is done
        # make sure not to have space at start
        if lineBuffer[:1] == " ":
            lineBuffer = lineBuffer[1:-1]
        else:
            lineBuffer = lineBuffer[:-1]

        # prevent sentances from having weird breaks
        if lineBuffer[-1:] in [","]:
            lineBuffer = lineBuffer[:-1] + "..."
        if lineBuffer[-1:] in [";", ":"]:
            lineBuffer = lineBuffer[:-1] + "."

        # count the number of quote marks
        quotes = 0
        for char in lineBuffer:
            if char == '"':
                quotes += 1
        # try to close quotes
        if quotes % 2 == 1:
            if lineBuffer[-1] != '"':
                lineBuffer += '"'
            else:
                lineBuffer = '"' + lineBuffer

        lineList.append(lineBuffer)
        lineBuffer = line
lineList.remove("")

# make and write changes to new file
with open("dante.json", "w") as file:
    json.dump(lineList, file, indent=0)
