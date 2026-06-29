import torch

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)


PATH="model/fake_news_model"


tokenizer = AutoTokenizer.from_pretrained(PATH)

model = AutoModelForSequenceClassification.from_pretrained(PATH)


def predict_news(text):

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True
    )


    with torch.no_grad():

        output = model(
            **inputs
        )


    probs = torch.softmax(
        output.logits,
        dim=1
    )


    confidence, pred = torch.max(
        probs,
        dim=1
    )


    confidence = confidence.item()
    pred = pred.item()


    if confidence >= 0.80:

        if pred == 1:

            return {
                "prediction": "Real",
                "confidence": round(confidence*100,2)
            }


        else:

            return {
                "prediction": "Fake",
                "confidence": round(confidence*100,2)
            }


    return {
        "prediction":"UNKNOWN",
        "confidence":round(confidence*100,2)
    }