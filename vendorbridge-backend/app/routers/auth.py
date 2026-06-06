# app/routers/auth.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.user import SignupRequest, LoginRequest, UserResponse, LoginResponse
from app.crud.auth import create_user, login_user
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])


# --- Signup ---
@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(data: SignupRequest, db: AsyncSession = Depends(get_db)):
    return await create_user(db, data)


# --- Login ---
@router.post("/login", response_model=LoginResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await login_user(db, data.email, data.password)


# --- Get Current User ---
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user