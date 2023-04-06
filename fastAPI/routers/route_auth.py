from fastapi import APIRouter
from fastapi import Response, Request, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from fastapi_csrf_protect import CsrfProtect

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

@router.get("/api/csrftoken", response_model=schemas.Csrf)
def get_csrf_token(csrf_protect: CsrfProtect = Depends()):
    csrf_token = csrf_protect.generate_csrf()
    res = {'csrf_token': csrf_token}
    return res


# sign up
@router.post("/api/register", response_model=schemas.UserInfo)
async def signup(request: Request, user: schemas.UserBody,
                 db: Session = Depends(get_db), csrf_protect: CsrfProtect = Depends()):
    csrf_token = csrf_protect.get_csrf_from_headers(request.headers)
    csrf_protect.validate_csrf(csrf_token)
    data = jsonable_encoder(user)
    new_user = await crud.db_signup(db=db, data=data)
    return new_user


# login
@router.post("/api/login", response_model=schemas.SuccessMsg)
async def login(request: Request, response: Response, user: schemas.UserBody,
                db: Session = Depends(get_db), csrf_protect: CsrfProtect = Depends()):
    csrf_token = csrf_protect.get_csrf_from_headers(request.headers)
    csrf_protect.validate_csrf(csrf_token)
    data = jsonable_encoder(user)
    token = await crud.db_login(db=db, data=data)
    response.set_cookie(key="access_token", value=f"Bearer {token}", httponly=True, samesite="none", secure=True)
    return {"message": "Successfully logged-in"}


# logout
@router.post("/api/logout", response_model=schemas.SuccessMsg)
def logout(request: Request, response: Response, csrf_protect: CsrfProtect = Depends()):
    csrf_token = csrf_protect.get_csrf_from_headers(request.headers)
    csrf_protect.validate_csrf(csrf_token)
    response.set_cookie(key="access_token", value="", httponly=True, samesite="none", secure=True)
    return {'message': 'Successfully logged-out'}


@router.get('/api/user', response_model=schemas.UserInfo)
def get_user_refresh_jwt(request: Request, response: Response):
    new_token, subject = auth.verify_update_jwt(request)
    response.set_cookie(key="access_token", value=f"Bearer {new_token}", httponly=True, samesite="none", secure=True)
    return {'email': subject}
