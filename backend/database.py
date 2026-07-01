import os
from pymongo import MongoClient


# Get MongoDB Atlas URL from Render environment variable
MONGO_URI = os.getenv("MONGO_URI")


if not MONGO_URI:
    raise Exception("MONGO_URI is not set")


client = MongoClient(MONGO_URI)


# Database name
db = client["health_fake_news"]


# Collections
history_collection = db["history"]

users_collection = db["users"]



# Test connection
try:
    client.admin.command("ping")
    print("MongoDB Atlas connected successfully")

except Exception as e:
    print("MongoDB connection failed:", e)