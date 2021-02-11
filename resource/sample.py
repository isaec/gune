import json, random
amount = int(input("how many samples?\n") or 2)
with open("dante.json") as file: dante = json.load(file)
for i in range(amount): print(f"\tnumber {i+1}:\n\n{random.choice(dante)}\n")