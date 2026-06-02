from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.minio import bootstrap_bucket
from app.api.v1.router import api_router
from app.core.security import decode_access_token


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure MinIO bucket exists
    try:
        bootstrap_bucket()
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f"MinIO bootstrap failed: {e}")
    yield
    # Shutdown: nothing to clean up


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-ready Full-Stack API with FastAPI, SQLAlchemy, and MinIO",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Auth Middleware
PUBLIC_PATHS = {"/api/v1/auth/login", "/api/v1/auth/register", "/api/docs", "/api/openapi.json", "/api/redoc", "/health"}

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.url.path not in PUBLIC_PATHS and request.method != "OPTIONS":
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Not authenticated"})
        
        token = auth_header.split(" ")[1]
        user_id = decode_access_token(token)
        if not user_id:
            return JSONResponse(status_code=401, content={"detail": "Invalid or expired token"})
        
        request.state.user_id = user_id
    
    response = await call_next(request)
    return response

# Mount API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "version": settings.APP_VERSION}
