from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import auth_router


app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth_router)

# --- Create all tables on startup ---
from utils.db import Base, engine
Base.metadata.create_all(bind=engine)
