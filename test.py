import psycopg2
from psycopg2 import Error, connect

try:
    connection = psycopg2.connect(user="postgres",password="postgres",host="localhost",port="5432",database="postgres")

    cursor = connection.cursor()

    print("PostgreSQLサーバの情報")
    print(connection.get_dsn_parameters(),"\n")

    cursor.execute("SELECT version();")

    record = cursor.fetchone()

    print("あなたは",record,"に接続されています\n")

except(Exception, Error) as error:
    print("PostgreSQLへの接続時のエラーが発生しました",error)
finally:
    if(connection):
        cursor.close()
        connection.close()
        print("PostgreSQLの接続が切断されました。")