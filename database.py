# from typing import Union      ### 1つの関数で返ってくる値がいくつか型の候補がある場合用
# import motor.motor_asyncio    ### MongoDBとの連携用
# import asyncio
# import certifi

from decouple import config  # 環境変数設定のため
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DBに接続
POSTGRES_USER = config('POSTGRES_USER')
POSTGRES_PASSWORD = config('POSTGRES_PASSWORD')
POSTGRES_SERVER = config('POSTGRES_SERVER')
POSTGRES_PORT = config('POSTGRES_PORT')
POSTGRES_DB = config('POSTGRES_DB')
POSTGRES_SCHEMA = config('POSTGRES_SCHEMA')

SQLALCHEMY_DATABASE_URL = "postgresql://{0}:{1}@{2}:{3}/{4}".format(
    POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_SERVER, POSTGRES_PORT, POSTGRES_DB
)

# 参照DBと参照スキーマを設定
engine = create_engine(SQLALCHEMY_DATABASE_URL,
                       connect_args={'options': '-csearch_path={}'.format(POSTGRES_SCHEMA)})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

'''
conn = engine.connect()
result = conn.execute(text("select 'hello world'"))
print(result.all())
conn.close()
'''
