from database import Base
from sqlalchemy import Column, Integer, String


# DBのカラムを設定
class Todo(Base):
    __tablename__ = "todo"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
