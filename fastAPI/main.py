from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi_csrf_protect import CsrfProtect
from fastapi_csrf_protect.exceptions import CsrfProtectError
from fastapi.middleware.cors import CORSMiddleware
# from typing import List

import models
import schemas
from database import engine
from routers import route_todo, route_auth

models.Base.metadata.create_all(bind=engine)

# インスタンスを生成
app = FastAPI()
app.include_router(route_todo.router)
app.include_router(route_auth.router)

origins = ['http://localhost:3000', 'https://fastapi-1436a.web.app']


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@CsrfProtect.load_config
def get_csrf_config():
    return schemas.CsrfSettings()


@app.exception_handler(CsrfProtectError)
def csrf_protect_exception_handler(request: Request, exc: CsrfProtectError):
    return JSONResponse(
        status_code=exc.status_code,
        content={'detail':  exc.message}
    )


@app.get("/", response_model=schemas.SuccessMsg)  # エンドポイントのパスを定義？
async def root():  # @app.get()の直下に置くと、ココのパスにアクセスがあったときに実行される
    return {"message": "Hello World"}
