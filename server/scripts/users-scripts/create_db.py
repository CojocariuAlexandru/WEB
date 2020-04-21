import mysql.connector

db_name = "TeVi_Auth"
db_table_name = "Users"

def get_db_connection(db):
    return mysql.connector.connect(
        host = "localhost",
        user = "root",
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

create_table_query = """CREATE TABLE {} (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(32),
                        password VARCHAR(64),
                        password_salt VARCHAR(16),
                        admin BOOLEAN)""".format(db_table_name)

mycursor.execute(create_table_query)
print(f"\"{db_table_name}\" table created!")