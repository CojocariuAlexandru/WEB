import mysql.connector

# db_name = "heroku_a3c53cb6e83619f"
db_name = "TeVi_Auth"
db_table_name = "Users"

# Use this function to connect to the docker container
#def get_db_connection(db):
#    return mysql.connector.connect(
#        host = "157.245.121.183",
#	    port = "5005",
#        user = "root",
#        password = "password",
#        database = db,
#	    auth_plugin='mysql_native_password'
#    )

def get_db_connection(db):
    return mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "",
        port = "3306",
        database = db
    )

# Use this function to connect to Heroku database
# def get_db_connection(db):
#     return mysql.connector.connect(
#         host = "us-cdbr-east-06.cleardb.net",
#         user = "b251147b1d5604",
#         password = "06e269f1",
# 	    database = "heroku_a3c53cb6e83619f"
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
