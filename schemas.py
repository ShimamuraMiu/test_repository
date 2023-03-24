########################################
# リクエストのデータ型を定義するファイル #
########################################

from pydantic import BaseModel  # FastAPIのモデル
# from typing import List, Optional


# route用
# BaseModelから継承して作成
class TodoBase(BaseModel):
    title: str
    description: str


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


# ユーザーがjson型で渡してくる用
class TodoBody(BaseModel):
    title: str
    description: str


# mainのget用
class SuccessMsg(BaseModel):
    message: str
