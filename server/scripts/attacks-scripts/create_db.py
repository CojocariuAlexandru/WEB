import os.path
from os import path

from sys import exit

import mysql.connector

import csv

db_name = "TeVi"
db_table_name = "Attacks"
csv_file_name = "data.csv"
distinct_values_file = 'distinct_values.txt'

#Use this function to connect to the docker container
# def get_db_connection(db):
#    return mysql.connector.connect(
#       host = "157.245.121.183",
#	port = "5006",
#       user = "root",
#       password = "password",
#       database = db,
#	auth_plugin='mysql_native_password'
#	)

def get_db_connection(db):
	return mysql.connector.connect(
        host = "localhost",
        user = "root",
 	    port = "3306",
        password = "",
        database = db
	)

mydb = get_db_connection("")
mycursor = mydb.cursor()

mycursor.execute("DROP DATABASE IF EXISTS {}".format(db_name))

mycursor.execute("CREATE DATABASE {}".format(db_name))
print(f"\"{db_name}\" database created!")

mydb = get_db_connection(db_name)
mycursor = mydb.cursor()

create_table_query = """ CREATE TABLE {} (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        date DATE,
                        extended BOOLEAN,
                        region VARCHAR(36),
                        country VARCHAR(36),
                        provState VARCHAR(50),
                        city VARCHAR(70),
                        latitude REAL(10,5),
                        longitude REAL(10,5),
                        summary VARCHAR(2436),
                        attackType VARCHAR(40),
                        success BOOLEAN,
                        suicide BOOLEAN,
                        targType VARCHAR(32),
                        targSubtype VARCHAR(76),
                        targetName VARCHAR(348),
                        targetNat VARCHAR(38),
                        groupName VARCHAR(116),
                        motive VARCHAR(904),
                        terrCount INT,
                        weaponType VARCHAR(80),
                        weaponSubtype VARCHAR(48),
                        weaponDetail VARCHAR(660),
                        killsCount INT,
                        woundedCount INT,
                        propExtent VARCHAR(50),
                        propComment VARCHAR(842),
                        addNotes VARCHAR(1940),
                        sCite1 VARCHAR(572),
                        sCite2 VARCHAR(572),
                        sCite3 VARCHAR(550))""".format(db_table_name)

mycursor.execute(create_table_query)
print(f"\"{db_table_name}\" table created!")

columns = {}

if path.exists(csv_file_name) == False:
    print(f"\"{csv_file_name}\" file not found!")
    exit(1)

insert_attack_query = """ INSERT INTO {} (
                                date,
                                extended,
                                region,
                                country,
                                provState,
                                city,
                                latitude,
                                longitude,
                                summary,
                                attackType,
                                success,
                                suicide,
                                targType,
                                targSubtype,
                                targetName,
                                targetNat,
                                groupName,
                                motive,
                                terrCount,
                                weaponType,
                                weaponSubtype,
                                weaponDetail,
                                killsCount,
                                woundedCount,
                                propExtent,
                                propComment,
                                addNotes,
                                sCite1,
                                sCite2,
                                sCite3)
                    VALUES (%s, %s, %s, %s, %s,
                            %s, %s, %s, %s, %s,
                            %s, %s, %s, %s, %s,
                            %s, %s, %s, %s, %s,
                            %s, %s, %s, %s, %s,
                            %s, %s, %s, %s, %s)""".format(db_table_name)

def process_varchar(row, col_name):
    return row[col_name]

def process_boolean(row, col_name):
    return False if row[col_name] == '' else (True if (int(row[col_name]) == 1) else False)

def process_int(row, col_name):
    return -1 if row[col_name] == '' else int(float(row[col_name]))

def process_float(row, col_name):
    return 0.0 if row[col_name] == '' else float(row[col_name])

def process_date(row, col_year_name, col_month_name, col_day_name):
    return row[col_year_name] + '-' + row[col_month_name] + '-' + row[col_day_name] if row[col_day_name] != '0' else '1'

with open(csv_file_name, mode='r') as attacks_file:
    csv_reader = csv.DictReader(attacks_file)
    line_count = 0
    for row in csv_reader:
        #print(line_count)
        #if line_count > 200:
        #    break
        values = (
            process_date(row, 'iyear', 'imonth', 'iday'),
            process_boolean(row, 'extended'),
            process_varchar(row, 'region_txt'),
            process_varchar(row, 'country_txt'),
            process_varchar(row, 'provstate'),
            process_varchar(row, 'city'),
            process_float(row, 'latitude'),
            process_float(row, 'longitude'),
            process_varchar(row, 'summary'),
            process_varchar(row, 'attacktype1_txt'),
            process_boolean(row, 'success'),
            process_boolean(row, 'suicide'),
            process_varchar(row, 'targtype1_txt'),
            process_varchar(row, 'targsubtype1_txt'),
            process_varchar(row, 'target1'),
            process_varchar(row, 'natlty1_txt'),
            process_varchar(row, 'gname'),
            process_varchar(row, 'motive'),
            process_int(row, 'nperps'),
            process_varchar(row, 'weaptype1_txt'),
            process_varchar(row, 'weapsubtype1_txt'),
            process_varchar(row, 'weapdetail'),
            process_int(row, 'nkill'),
            process_int(row, 'nwound'),
            process_varchar(row, 'propextent_txt'),
            process_varchar(row, 'propcomment'),
            process_varchar(row, 'addnotes'),
            process_varchar(row, 'scite1'),
            process_varchar(row, 'scite2'),
            process_varchar(row, 'scite3')
        )
        mycursor.execute(insert_attack_query, values)
        line_count += 1
    print(f"Inserted {line_count-1} attacks in the database!")
        
mydb.commit()

columns_to_print_diff_values = ["region", "country", "attackType", "weaponType"]

with open(distinct_values_file, "w") as file:
    for column in columns_to_print_diff_values:
        select_distincts_query = """SELECT DISTINCT {} FROM {}""".format(column, db_table_name)
        
        value = (column)
        mycursor.execute(select_distincts_query)
        distinct_values = mycursor.fetchall()
        
        line_str = ','.join(map(str,distinct_values)).replace(',)', '').replace('(', '')

        file.write(column + ':\n')
        file.write(line_str)
        file.write('\n')

print(f'Created file \"{distinct_values_file}\"!')