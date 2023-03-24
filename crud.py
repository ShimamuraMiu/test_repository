from sqlalchemy.orm import Session

import models
import schemas


# SELECT（データ1つ）
def get_todo(db: Session, todo_id: int):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()


# SELECT ALL
def get_todos(db: Session, offset: 0, limit: 100):
    # offset：どこから、limit：どこまで
    return db.query(models.Todo).offset(offset).limit(limit).all()


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


'''
# MongoDB

# DBから取得した物を辞書型に変換して返す関数 ###
def todo_serializer(todo) -> dict:
    return {
        "id": str(todo["_id"]),
        "title": todo["title"],
        "description": todo["description"]
    }


### INSERT文 ###
async def db_create_todo(data: dict) -> Union[dict, bool]:
    ### DBに列を追加している？ ###
    # 「InsertOneResult」という型のインスタンス
    todo = await collection_todo.insert_one(data)


    ### DBから取得 ###
    # todo.inserted_id で、何を追加したかが取れる（"_id"はお決まり）
    # Document or None
    new_todo = await collection_todo.find_one({"_id": todo.inserted_id})


    ### 値を返す ###
    if new_todo:  # DBに値があるとき
        return todo_serializer(new_todo)  # dict型
    else:  # Noneのとき
        return False
'''
