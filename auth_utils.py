############
# User認証 #
############

import jwt
from fastapi import HTTPException
from passlib.context import CryptContext
from datetime import datetime, timedelta
from decouple import config

# Keyの読み込み
JWT_KEY = config('JWT_KEY')


class AuthJwtCsrf():
    pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
    secret_key = JWT_KEY

    # ハッシュ化（String）
    def generate_hashed_pw(self, password) -> str:
        return self.pwd_ctx.hash(password)

    # ユーザーが入力したパスワードと保存されているパスワードが合っているか
    def verify_pw(self, plain_pw, hashed_pw) -> bool:
        return self.pwd_ctx.verify(plain_pw, hashed_pw)

    # JWT生成
    def encode_jwt(self, email) -> str:
        payload = {
            # 有効期限（5分間に設定）
            'exp': datetime.utcnow() + timedelta(days=0, minutes=5),
            # JWTが生成された日時
            'iat': datetime.utcnow(),
            'sub': email
        }
        return jwt.encode(
            payload,
            self.secret_key,
            algorithm='HS256'
        )

    # JWTをデコード
    def decode_jwt(self, token) -> str:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload['sub']

        except jwt.ExpiredSignatureError:  # JWTが失効している場合
            raise HTTPException(status_code=401, detail='The JWT has expired')

        except jwt.InvalidTokenError:  # JWTのフォーマットじゃないとか空とかの場合
            raise HTTPException(status_code=401, detail='JWT is not valid')
