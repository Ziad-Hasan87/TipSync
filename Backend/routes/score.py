from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from utils.db import get_db
from utils.auth import get_current_user
from models.auth import User
from models.score import Score

score_router = APIRouter(prefix="/scores", tags=["scores"])


@score_router.get("/")
async def get_user_score(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )

    scores = (
        db.query(Score)
        .filter(Score.user_id == user.id)
        .order_by(Score.score.desc())
        .limit(10)
        .all()
    )
    return scores


@score_router.get("/leaderboard")
async def get_leaderboard(game_mode: str, db: Session = Depends(get_db)):
    # ORM-based query with JOIN to User
    results = (
        db.query(Score, User.email)
        .join(User, Score.user_id == User.id)
        .filter(Score.game_mode == game_mode)
        .order_by(Score.score.desc())
        .limit(10)
        .all()
    )

    leaderboard = []
    for score, email in results:
        # Remove domain from email for privacy
        safe_email = email.split("@")[0]
        leaderboard.append({
            "id": score.id,
            "score": score.score,
            "accuracy": score.accuracy,
            "timestamp": score.timestamp,
            "game_mode": score.game_mode,
            "user_id": score.user_id,
            "user_email": safe_email,
        })

    return leaderboard


@score_router.post("/")
async def submit_score(
    score: float = Body(...),
    accuracy: float = Body(...),
    game_mode: str = Body(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )

    new_score = Score(
        user_id=user.id,
        score=score,
        accuracy=accuracy,
        game_mode=game_mode
    )
    db.add(new_score)
    db.commit()
    db.refresh(new_score)

    return {
        "message": "Score submitted successfully",
        "score_id": new_score.id
    }
