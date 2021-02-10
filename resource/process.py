#read file to memory
with open("danteInferno.txt", "r") as file:
    filedata = file.readlines()



#make and write changes to new file
with open("dante.txt", "w") as file:
    for line in filedata:
        if "Inferno:" in line or line == "\n": continue
        line = line.replace("  ", "").replace('"',"")
        file.write(line)