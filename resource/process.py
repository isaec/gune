import json

# functions
def count_char(str, chr):
    count = 0
    for char in str:
        if char == chr:
            count += 1
    return count


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
            # take off the space and the linebreak at end
            lineBuffer = lineBuffer[1:-1]
        else:
            # just remove linebreak
            lineBuffer = lineBuffer[:-1]

        # prevent sentances from having weird breaks
        if lineBuffer[-1:] in [","]:
            lineBuffer = lineBuffer[:-1] + "..."
        if lineBuffer[-1:] in [";", ":"]:
            lineBuffer = lineBuffer[:-1] + "."

        # count the number of quote marks
        quotes = count_char(lineBuffer, '"')
        # try to close quotes
        if quotes % 2 == 1:
            quotes += 1
            if lineBuffer[-1] != '"':
                lineBuffer += '"'
            else:
                lineBuffer = '"' + lineBuffer

        # check if the entire block is only single quote
        if quotes == 2 and ((lineBuffer[0], lineBuffer[-1]) == ('"', '"')):
            # trim off the quotes
            lineBuffer = lineBuffer[1:-1]

        lineList.append(lineBuffer)
        lineBuffer = line
lineList.remove("")

# make and write changes to new file
with open("dante.json", "w") as file:
    json.dump(lineList, file, indent=0)
