from fastapi import FastAPI, HTTPException, Depends, Header,Request, Form
from pydantic import BaseModel
import bcrypt
from fastapi.responses import HTMLResponse # For returning HTML
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import jwt
print("JWT imported successfully!")
from jwt import PyJWKClient
from typing import Optional

from dotenv import load_dotenv
import os

load_dotenv()  # Ensure environment variables are loaded
# Print for debugging
print("USER_POOL_ID:", os.getenv("USER_POOL_ID"))
print("USER_REGION:", os.getenv("USER_REGION"))
print("USER_CLIENT_ID:", os.getenv("USER_CLIENT_ID"))

app = FastAPI()


# ここは自分のローカルのアドレス入れてください
# Port は指定可能　uvicorn main:app --reload --port 8080
origins = [
    "http://localhost:5173",  # Allow React frontend
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]


# Add CORS middlewar
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow all origins for testing (you can restrict it later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ユーザーデータベース (メモリ上) Fake database
USER_DATABASE = {
    "rachel@example.com": {"id": 1, "name": "Rachel", "password_hash": bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode()},  # 初期データ (ハッシュ化済みパスワード)
    "ben@example.com": {"id": 2, "name": "Ben", "password_hash": bcrypt.hashpw("password456".encode(), bcrypt.gensalt()).decode()},    # 初期データ (ハッシュ化済みパスワード)
    "emily@test.com": {"id": 3, "name": "Emily", "password_hash": bcrypt.hashpw("Emily@123".encode(), bcrypt.gensalt()).decode()},  # 初期データ (ハッシュ化済みパスワード)
    "test@test.com": {"id": 4, "name": "Mr Test", "password_hash": bcrypt.hashpw("Password1!".encode(), bcrypt.gensalt()).decode()},
    "hello@test.com": {"id": 5, "name": "Hello","password_hash": bcrypt.hashpw("Hello@123".encode(), bcrypt.gensalt()).decode()}
}

# Cognito part
COGNITO_USER_POOL_ID = os.getenv('USER_POOL_ID')
COGNITO_REGION = os.getenv('USER_REGION')
COGNITO_JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}/.well-known/jwks.json"
COGNITO_CLIENT_ID = os.getenv('USER_CLIENT_ID')
COGNITO_ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}"


print("COGNITO_JWKS_URL:", COGNITO_JWKS_URL)

class LoginRequest(BaseModel):
    email: str
    token: str
    

class UserSignUp(BaseModel):
    email: str
    name: str
    password: str



@app.get("/")
async def root():
    return {"message": "Hello World"}    

@app.get("/api/users")
async def userList():
    return {"user:":USER_DATABASE}


# //////////////////////////
@app.post("/api/signup")
async def signup(user: UserSignUp):
    if user.email in USER_DATABASE:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    try:
        hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()  # パスワードをハッシュ化
        USER_DATABASE[user.email] = {
            "id": len(USER_DATABASE) + 1,
            "name": user.name,
            "password_hash": hashed_password
        }
        
        print("USER_DATABASE after update:", USER_DATABASE)  
        return {"message": "User registered successfully"}

    except Exception as e:  # Catch potential database errors
        print(f"Error during signup: {e}")  # Log the error for debugging
        raise HTTPException(status_code=500, detail=f"An error occurred during signup: {e}")  

def verify_cognito_token(token: str):
    """Fetch Cognito public keys and verify the token"""
    try:
        jwks_client = PyJWKClient(COGNITO_JWKS_URL)
        signing_key = jwks_client.get_signing_key_from_jwt(token).key
        decoded_token = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=COGNITO_CLIENT_ID,
            issuer=COGNITO_ISSUER
        )
        return decoded_token
   
    except jwt.ExpiredSignatureError:
        print("Error: Token expired")
        raise HTTPException(status_code=401, detail="Token has expired")

    except jwt.InvalidAudienceError:
        print("Error: Invalid audience")
        raise HTTPException(status_code=401, detail="Invalid audience in token")

    except jwt.InvalidIssuerError:
        print("Error: Invalid issuer")
        raise HTTPException(status_code=401, detail="Invalid issuer in token")

    except jwt.DecodeError:
        print("Error: Token decode failed")
        raise HTTPException(status_code=401, detail="Token decode failed")

    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Token verification error: {str(e)}")
    
    
@app.post("/api/login")
async def login(request: LoginRequest):
    """Login endpoint that checks if user exists in the local database after verifying token"""
    decoded_token = verify_cognito_token(request.token)

    # Check if the email in the token matches the email in the request
    token_email = decoded_token.get("email")
    if not token_email:
        raise HTTPException(status_code=401, detail="Invalid token: Email missing")

    if request.email != token_email:
        raise HTTPException(status_code=403, detail="Email mismatch: Token email does not match request email")

    # Check if user exists in the local database
    if token_email not in USER_DATABASE:
        raise HTTPException(status_code=403, detail="User not found in database")

    user = USER_DATABASE[token_email]
    return {"message": "Login successful", "user": user}


#     PostgreSqlの場合こんな感じ？
# # 🔹 Check if user exists in PostgreSQL database
#     with conn.cursor() as cur:
#         cur.execute("SELECT * FROM users WHERE email = %s", (token_email,))
#         user = cur.fetchone()

#     if not user:
#         raise HTTPException(status_code=403, detail="User not found in database")

#     return {"message": "Login successful", "user": user}