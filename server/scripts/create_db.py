import os.path
from os import path

from sys import exit

import mysql.connector

import csv

dbName = "TeVi"
dbTableName = "Attacks"
csvFileName = "data.csv"
csvConfFileName = "db_creation_config.txt"

def getDbConnection(db):
    return mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "",
        database = db
    )

mydb = getDbConnection("")
mycursor = mydb.cursor()

mycursor.execute("DROP DATABASE IF EXISTS Tevi")

mycursor.execute("CREATE DATABASE Tevi")
print(f"\"{dbName}\" database created!")

mydb = getDbConnection(dbName)
mycursor = mydb.cursor()

createTableQuery = """ CREATE TABLE {} (id INT AUTO_INCREMENT PRIMARY KEY,
                        country VARCHAR(255),
                        region VARCHAR(255),
                        latitude REAL(10,5),
                        longitude REAL(10,5),
                        attack_type VARCHAR(255),
                        motive VARCHAR(1023),
                        terrorists_count INT,
                        kills_count INT,
                        wounded_count INT,
                        success BOOLEAN,
                        weapon_type VARCHAR(255),
                        weapon_details VARCHAR(1023))""".format(dbTableName)

mycursor.execute(createTableQuery)
print(f"\"{dbTableName}\" table created!")

if path.exists(csvConfFileName) == False:
    print(f"\"{csvConfFileName}\" file not found!")
    exit(1)

columns = {}

f = open(csvConfFileName, "r")
lineNumber = 1
for line in f:
    tokens = line.split()
    if len(tokens) != 2:
        print(f"Error in file \"{csvConfFileName}\", line {lineNumber}! Too many tokens!")
        exit(1)
    columns[tokens[0]] = tokens[1]
    lineNumber += 1
f.close()

if path.exists(csvFileName) == False:
    print(f"\"{csvFileName}\" file not found!")
    exit(1)

insertAttackQuery = """ INSERT INTO attacks (country, region, latitude, longitude, attack_type, motive,
                                            terrorists_count, kills_count, wounded_count, success, weapon_type, weapon_details)
                                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

with open(csvFileName, mode='r') as attacks_file:
    csv_reader = csv.DictReader(attacks_file)
    line_count = 0
    for row in csv_reader:
        if line_count > 0:
            values = (row['country'], row['region_txt'], (0.0 if row['latitude'] == '' else float(row['latitude'])), (0.0 if row['longitude'] == '' else float(row['longitude'])), 
                        row['attacktype1_txt'], row['motive'], (-1 if row['nperps'] == '' else int(float(row['nperps']))), (-1 if row['nkill'] == '' else int(float(row['nkill']))), 
                        (-1 if row['nwound'] == '' else int(float((row['nwound'])))), (False if row['success'] == '' else (True if (int(row['success']) == 1 ) else False)), row['weaptype1_txt'], row['weapdetail'])
            mycursor.execute(insertAttackQuery, values)
        line_count += 1
    print(f"Inserted {line_count-1} attacks in the database!")
        
mydb.commit()