import os
import requests
from dotenv import load_dotenv

load_dotenv()
KEY=os.getenv("NEWS_API_KEY")

def verify_news(text):
    url = "https://newsapi.org/v2/everything"
    params={

        "q":text,
        "apikey":KEY

    }

    response=requests.get(url,params=params)

    data=response.json()

    if data.get(
        "totalresults",
        0
    )>0:
        return True
    return False

