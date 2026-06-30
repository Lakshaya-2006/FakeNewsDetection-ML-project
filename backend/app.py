from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predict import predict_news
from newsapi import verify_news

from database import history_collection, users_collection
from passlib.context import CryptContext
from datetime import datetime


app = FastAPI()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allow React Vite frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class News(BaseModel):
    text: str

class User(BaseModel):
    name: str
    email: str
    password: str



@app.get("/")
def home():

    return {
        "message": "Health Fake News Detection API Running"
    }



@app.post("/predict")
def check(news:News):


    result = predict_news(
        news.text
    )


    if result["prediction"]=="UNKNOWN":


        found = verify_news(
            news.text
        )


        if found:

            result={
                "prediction":"Real (NewsAPI verified)",
                "confidence":"Verified"
            }


        else:

            result={
                "prediction":"I am not sure",
                "confidence":result["confidence"]
            }



    # SAVE TO MONGODB

    history_collection.insert_one(
        {
            "text":news.text,
            "prediction":result["prediction"],
            "confidence":result["confidence"],
            "date":datetime.now()
        }
    )


    return result

@app.get("/history")
def get_history():


    data=list(
        history_collection.find(
            {},
            {"_id":0}
        )
    )


    return data

@app.delete("/history")
def clear_history():

    history_collection.delete_many({})


    return {
        "message":"History cleared"
    }

@app.post("/register")
def register(user:User):

    existing_user = users_collection.find_one(
        {"email":user.email}
    )

    if existing_user:
        return {
            "message":"User already exists"
        }


    hashed_password = pwd_context.hash(
        user.password[:72]
    )


    users_collection.insert_one(
        {
            "name":user.name,
            "email":user.email,
            "password":hashed_password
        }
    )


    return {
       
    "message":"Registration successful",
    "name": user.name,
    "email": user.email
}
    

@app.post("/login")
def login(user:User):


    found_user = users_collection.find_one(
        {
            "email":user.email
        }
    )


    if not found_user:
        return {
            "message":"User not found"
        }



    if pwd_context.verify(
        user.password,
        found_user["password"]
    ):

        return {
            "message":"Login successful",
            "name":found_user["name"],
            "email":found_user["email"]
        }



    return {
        "message":"Wrong password"
    }