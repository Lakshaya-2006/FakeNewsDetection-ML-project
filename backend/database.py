from pymongo import MongoClient


client = MongoClient(
    "mongodb://127.0.0.1:27017"
)


db = client["health_fake_news"]


history_collection = db["history"]

users_collection = db["users"]





# test connection
try:
    client.admin.command("ping")
    print("MongoDB connected successfully")
except Exception as e:
    print("MongoDB connection failed", e)