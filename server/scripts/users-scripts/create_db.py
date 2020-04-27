import mysql.connector

db_name = "TeVi_Auth"
db_table_name = "Users"

# Use this function to connect to the docker container
def get_db_connection(db):
    return mysql.connector.connect(
        host = "157.245.121.183",
	    port = "5005",
        user = "root",
        password = "password",
        database = db,
	    auth_plugin='mysql_native_password'
    )

# def get_db_connection(db):
#     return mysql.connector.connect(
#         host = "localhost",
#         user = "root",
#         password = "password",
# 	      port = "5005",
#         database = db
#     )

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