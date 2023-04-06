from fastapi import APIRouter
from fastapi import Response, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from auth_utils import AuthJwtCsrf
from database import SessionLocal

import schemas
import crud

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

# sign up
@router.post("/api/register", response_model=schemas.UserInfo)
async def signup(user: schemas.UserBody, db: Session = Depends(get_db)):
    data = jsonable_encoder(user)
    new_user = await crud.db_signup(db=db, data=data)
    return new_user


# login
@router.post("/api/login", response_model=schemas.SuccessMsg)
async def login(response: Response, user: schemas.UserBody, db: Session = Depends(get_db)):
    data = jsonable_encoder(user)
    token = await crud.db_login(db=db, data=data)
    response.set_cookie(key="access_token", value=f"Bearer {token}", httponly=True, samesite="none", secure=True)
    return {"message": "Successfully logged-in"}
