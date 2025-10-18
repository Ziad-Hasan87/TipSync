from fastapi import APIRouter
from utils.auth import get_current_user
from models.auth import User
from fastapi import Depends
from utils.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
from models.score import Score
from fastapi import Body

score_router = APIRouter(prefix="/scores", tags=["scores"])

@score_router.get("/")
async def get_user_score(user: User = Depends(get_current_user), db: Session =Depends(get_db)):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    score = select(Score).where(Score.user_id == user.id).order_by(Score.score.desc()).limit(10)
    result = db.execute(score).scalars().all()
    return result
@score_router.get("/leaderboard")
async def get_leaderboard(game_mode: str, db: Session = Depends(get_db)):
    score = select(Score).where(Score.game_mode == game_mode).order_by(Score.score.desc()).limit(10)
    result = db.execute(score).scalars().all()
    return result
@score_router.post("/")
async def submit_score(score: float = Body(...), accuracy: float = Body(...), game_mode: str = Body(...), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    new_score = Score(user_id=user.id, score=score, accuracy=accuracy, game_mode=game_mode)
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return {"message": "Score submitted successfully", "score_id": new_score.id}