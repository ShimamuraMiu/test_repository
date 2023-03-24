# from routers import route_todo  ### ファイルからインポート

from fastapi import FastAPI
# from typing import List

import models
import schemas
from database import engine
from routers import route_todo

# これは何をしている？
models.Base.metadata.create_all(bind=engine)

# インスタンスを生成
app = FastAPI()
app.include_router(route_todo.router)


@app.get("/", response_model=schemas.SuccessMsg)  # エンドポイントのパスを定義？
async def root():  # @app.get()の直下に置くと、ココのパスにアクセスがあったときに実行される
    return {"message": "Hello World"}
