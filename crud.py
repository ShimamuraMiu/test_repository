#############################
# Create Read Update Delete #
#############################

from sqlalchemy.orm import Session
from fastapi import HTTPException

import models
import schemas
import auth_utils


# --------------- todo ---------------
# SELECT ALL
# -> list ?
async def get_todos(db: Session, offset: 0, limit: 100):
    # offset：どこから、limit：どこまで
    return db.query(models.Todo).offset(offset).limit(limit).all()


# SELECT（データ1つ）
# -> Union[dict, bool] ?
async def get_todo(db: Session, todo_id: int):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()


# INSERT
async def create_todo(db: Session, todo: schemas.TodoCreate):
    todo_obj = models.Todo(
        title=todo.title,
        description=todo.description,
    )
    db.add(todo_obj)
    db.commit()
    db.refresh(todo_obj)
    return todo_obj


# UPDATE
async def update_todo(db: Session, id: str, data: dict):
    todo_obj = await get_todo(db, id)
    if todo_obj is not None:
        todo_obj.title = data["title"]
        todo_obj.description = data["description"]
        db.commit()
        db.refresh(todo_obj)
        return todo_obj


# DELETE
async def delete_todo(db: Session, id: int) -> bool:
    todo_obj = await get_todo(db, id)
    if todo_obj is not None:
        db.delete(todo_obj)
        db.commit()
        return True
    else:
        return False


# --------------- user ---------------
auth = auth_utils.AuthJwtCsrf()


# SELECT
async def get_user(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# sign up
async def db_signup(db: Session, data: dict):
    email = data.get("email")
    password = data.get("password")

    overlap_user = await get_user(db, email)

    # Emailが既存の場合
    if overlap_user is not None:
        raise HTTPException(status_code=400, detail='Email is already taken')

    # パスワードが6文字未満の場合
    if not password or len(password) < 6:
        raise HTTPException(status_code=400, detail='Password too short')

    # INSERT
    user_obj = models.User(
        email=email,
        password=auth.generate_hashed_pw(password),
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)

    add_user = await get_user(db, email)
    return add_user


# login
async def db_login(db: Session, data: dict) -> str:
    email = data.get("email")
    password = data.get("password")

    user = await get_user(db, email)

    # 認証できない場合
    if not user or not auth.verify_pw(password, user.password):
        raise HTTPException(status_code=401, detail='Invalid email or password')

    token = auth.encode_jwt(user.email)
    return token
