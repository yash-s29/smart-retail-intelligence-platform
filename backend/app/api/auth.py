from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.jwt_handler import create_access_token
from app.core.security import get_password_hash, verify_password
from app.database.session import get_db
from app.schemas.user import (
    ChangePasswordRequest,
    Token,
    UserCreate,
    UserRead,
)
from app.services.auth_service import (
    authenticate_user,
    create_user,
    get_current_user,
    get_user_by_email,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ==========================================================
# Register
# ==========================================================

@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: UserCreate,
    db: Session = Depends(get_db),
) -> Token:

    existing_user = get_user_by_email(db, payload.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = create_user(db, payload)

    access_token = create_access_token(user.email)

    return Token(
        access_token=access_token,
        user=UserRead.model_validate(user),
    )


# ==========================================================
# Login
# ==========================================================

@router.post("/login", response_model=Token)
async def login(
    request: Request,
    db: Session = Depends(get_db),
) -> Token:

    content_type = request.headers.get("content-type", "")

    if (
        "application/x-www-form-urlencoded" in content_type
        or "multipart/form-data" in content_type
    ):
        form_data = await request.form()

        email = str(
            form_data.get("username")
            or form_data.get("email")
            or ""
        )

        password = str(
            form_data.get("password")
            or ""
        )

    else:
        body = await request.json()

        email = str(body.get("email") or "")
        password = str(body.get("password") or "")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email and password are required",
        )

    user = authenticate_user(db, email, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(user.email)

    return Token(
        access_token=access_token,
        user=UserRead.model_validate(user),
    )


# ==========================================================
# Change Password
# ==========================================================

@router.post(
    "/change-password",
    status_code=status.HTTP_200_OK,
)
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    if not verify_password(
        payload.current_password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect",
        )

    current_user.hashed_password = get_password_hash(
        payload.new_password
    )

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Password updated successfully"
    }


# ==========================================================
# Swagger Login
# ==========================================================

@router.post("/token", response_model=Token)
def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:

    user = authenticate_user(
        db,
        form_data.username,
        form_data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(user.email)

    return Token(
        access_token=access_token,
        user=UserRead.model_validate(user),
    )


# ==========================================================
# Current User
# ==========================================================

@router.get(
    "/me",
    response_model=UserRead,
)
def me(
    current_user=Depends(get_current_user),
):
    return current_user