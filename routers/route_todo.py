#######################
# エンドポイントの親？ #
#######################

from fastapi import Response, HTTPException  # 型をインポート
from fastapi import APIRouter, Depends                # 型をインポート
from sqlalchemy.orm import Session

from database import SessionLocal
import schemas                                        # schemasファイルからインポート
import crud                                           # crudファイルをインポート
from starlette.status import HTTP_201_CREATED         # ステータス上書き用
from fastapi.encoders import jsonable_encoder         # jsonからdictに変換
from auth_utils import AuthJwtCsrf

# インスタンス化
router = APIRouter()
auth = AuthJwtCsrf()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------エンドポイント作成---------------

# INSERT
@router.post("/api/todo", response_model=schemas.Todo)  # 型の指定（response_model）
async def create_todo(response: Response, todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    res = await crud.create_todo(db=db, todo=todo)
    response.status_code = HTTP_201_CREATED
    if res:
        return res
    raise HTTPException(status_code=404, detail="Create task failed")


# SELECT ALL
@router.get("/api/todo/", response_model=list[schemas.Todo])
async def get_todos(offset: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    res = await crud.get_todos(db, offset=offset, limit=limit)
    return res


# SELECT（データ1つ）
@router.get("/api/todo/{todo_id}", response_model=schemas.Todo)
async def get_single_todo(todo_id: int, db: Session = Depends(get_db)):
    res = await crud.get_todo(db, todo_id=todo_id)
    if res:
        return res
    raise HTTPException(status_code=404, detail=f"Task of ID: {todo_id} doesn't exist")


# UPDATE
@router.put("/api/todo/{todo_id}", response_model=schemas.Todo)
async def update_todo(todo_id: int, data: schemas.TodoBody, db: Session = Depends(get_db)):
    todo = jsonable_encoder(data)
    res = await crud.update_todo(db=db, id=todo_id, data=todo)
    if res is None:
        raise HTTPException(status_code=404, detail="Update task failed")
    return res


# DELETE
@router.delete("/api/todo/{todo_id}", response_model=schemas.SuccessMsg)
async def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    res = await crud.delete_todo(db=db, id=todo_id)  # T or F
    if res:
        return {'message': 'Successfully deleted'}
    raise HTTPException(status_code=404, detail="Delete task failed")
