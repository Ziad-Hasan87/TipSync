from fastapi import APIRouter, Depends, HTTPException, status, Body, Query
from sqlalchemy.orm import Session
from utils.db import get_db
from utils.auth import get_current_user
from models.auth import User
from models.score import Score

score_router = APIRouter(prefix="/scores", tags=["scores"])

# 🧾 Get current user's top scores by game mode and difficulty
@score_router.get("/")
async def get_user_score(
    game_mode: str = Query(..., regex="^(speed|sync)$", description="Filter by game mode"),
    difficulty: str = Query("easy", regex="^(easy|hard)$", description="Filter by difficulty"),
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
        .filter(
            Score.user_id == user.id,
            Score.game_mode == game_mode,
            Score.difficulty == difficulty
        )
        .order_by(Score.score.desc())
        .limit(10)
        .all()
    )

    return scores

# 🌍 Global leaderboard by mode + difficulty
@score_router.get("/leaderboard")
async def get_leaderboard(
    game_mode: str = Query(..., regex="^(speed|sync)$", description="Game mode"),
    difficulty: str = Query("easy", regex="^(easy|hard)$", description="Difficulty level"),
    db: Session = Depends(get_db)
):
    results = (
        db.query(Score, User.email)
        .join(User, Score.user_id == User.id)
        .filter(Score.game_mode == game_mode, Score.difficulty == difficulty)
        .order_by(Score.score.desc())
        .limit(10)
        .all()
    )

    leaderboard = []
    for score, email in results:
        safe_email = email.split("@")[0]
        leaderboard.append({
            "id": score.id,
            "score": score.score,
            "accuracy": score.accuracy,
            "timestamp": score.timestamp,
            "game_mode": score.game_mode,
            "difficulty": score.difficulty,
            "user_id": score.user_id,
            "user_email": safe_email,
        })

    return leaderboard

# 🧠 Submit new score with difficulty
@score_router.post("/")
async def submit_score(
    score: float = Body(...),
    accuracy: float = Body(...),
    game_mode: str = Body(...),
    difficulty: str = Body("easy", description="Difficulty level (easy or hard)"),
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
        game_mode=game_mode,
        difficulty=difficulty
    )

    db.add(new_score)
    db.commit()
    db.refresh(new_score)

    return {
        "message": "Score submitted successfully",
        "score_id": new_score.id,
        "difficulty": new_score.difficulty
    }
