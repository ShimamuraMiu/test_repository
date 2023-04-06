########################################
# リクエストのデータ型を定義するファイル #
########################################

from pydantic import BaseModel  # FastAPIのモデル
from typing import Optional
from decouple import config

CSRF_KEY = config('CSRF_KEY')


# SCRF用
class CsrfSettings(BaseModel):
    secret_key: str = CSRF_KEY


# route用
# BaseModelから継承して作成
class TodoBase(BaseModel):
    title: str
    description: str


class UserBase(BaseModel):
    email: str
    password: str


'''
Memo

・TodoCreate、TodoはTodoBaseの拡張
'''


class TodoCreate(TodoBase):
    pass


class Todo(TodoBase):
    id: int

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    pass


# ユーザーがjson型で渡してくる用
class TodoBody(BaseModel):
    title: str
    description: str


class UserBody(BaseModel):
    email: str
    password: str


class UserInfo(BaseModel):
    id: Optional[int] = None
    email: str

    class Config:
        orm_mode = True


class Csrf(BaseModel):
    csrf_token: str


# mainのget用
class SuccessMsg(BaseModel):
    message: str
