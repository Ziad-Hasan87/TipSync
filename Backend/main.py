from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import auth_router
from routes.score import score_router
from utils.db import Base, engine

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth_router)
app.include_router(score_router)

# Create tables on startup (safe: only creates missing tables)
Base.metadata.create_all(bind=engine)

# --- OpenAPI / Swagger: add Bearer auth scheme ---
# Store original openapi function and extend its output
_original_openapi = app.openapi

bearer_scheme = {
    "type": "http",
    "scheme": "bearer",
    "bearerFormat": "JWT",
}


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = _original_openapi()
    components = openapi_schema.setdefault("components", {})
    security_schemes = components.setdefault("securitySchemes", {})
    security_schemes.setdefault("BearerAuth", bearer_scheme)
    # Apply globally to all routes
    openapi_schema.setdefault("security", [{"BearerAuth": []}])
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


if __name__ == "__main__":
    import os
    import uvicorn

    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)


