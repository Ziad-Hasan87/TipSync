import sqlalchemy as sa
from utils.db import Base

class Score(Base):
    __tablename__ = "scores"

    id = sa.Column(sa.Integer, primary_key=True, index=True)
    user_id = sa.Column(sa.Integer, sa.ForeignKey("users.id"), nullable=False)
    score = sa.Column(sa.Float, nullable=False)
    accuracy = sa.Column(sa.Float, nullable=False)
    game_mode = sa.Column(sa.String, nullable=False)
    difficulty = sa.Column(sa.String, nullable=False, server_default="easy")
    timestamp = sa.Column(sa.DateTime, server_default=sa.func.now(), nullable=False)