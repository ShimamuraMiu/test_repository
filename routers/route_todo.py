#######################
# エンドポイントの親？ #
#######################

from fastapi import Request, Response, HTTPException  # 型をインポート
from fastapi import APIRouter, Depends                # 型をインポート
from sqlalchemy.orm import Session

from database import SessionLocal
import schemas                                        # schemasファイルからインポート
import crud                                           # crudファイルをインポート
from starlette.status import HTTP_201_CREATED         # ステータス上書き用
# from fastapi.encoders import jsonable_encoder       # jsonからdictに変換

router = APIRouter()  # インスタンス化


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# エンドポイント作成
@router.post("/api/todo", response_model=schemas.Todo)  # 型の指定（response_model）
async def create_todo(request: Request, response: Response,
                      todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    res = await crud.create_todo(db=db, todo=todo)
    response.status_code = HTTP_201_CREATED
    if res:
        return res
    raise HTTPException(status_code=404, detail="Create task failed")


@router.get("/api/todo/", response_model=list[schemas.Todo])
def read_todos(offset: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    todos = crud.get_todos(db, offset=offset, limit=limit)
    return todos


@router.get("/api/todo/{todo_id}", response_model=schemas.Todo)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = crud.get_todo(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo


'''
@router.post("/api/todos/", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    print(todo)
    return crud.create_todo(db=db, todo=todo)
'''

'''
### エンドポイント作成 ###
@router.post("/api/todo", response_model=Todo)  # 型の指定（response_model）
async def create_todo(request: Request, response: Response, data: TodoBody):
    todo = jsonable_encoder(data)     # dict
    res = await db_create_todo(todo)  # dict or bool
    response.status_code = HTTP_201_CREATED
    if res:
        return res
    raise HTTPException(
        status_code=404, detail="Create task failed")
'''
