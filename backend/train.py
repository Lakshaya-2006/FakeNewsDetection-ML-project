import pandas as pd
import os

from datasets import Dataset

from transformers import(
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer
)

MODEL_NAME="distilbert-base-uncased"

df=pd.read_csv("dataset/health_tips_dataset.csv")
df.dropna(inplace=True)
df['label']=df['label'].str.strip().str.upper()
df['label']=df['label'].map({ "REAL":1,"FAKE":0})

dataset=Dataset.from_pandas(df,preserve_index=False)
tokenizer=AutoTokenizer.from_pretrained(MODEL_NAME)

def tokenize(batch):
    return tokenizer(
        batch["health_tip"],
        truncation=True,
        padding="max_length",
        max_length=256
    )

dataset=dataset.map(tokenize,batched=True)
dataset=dataset.train_test_split(test_size=0.2)

model=AutoModelForSequenceClassification.from_pretrained(MODEL_NAME,num_labels=2)

args=TrainingArguments(
    output_dir="results",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    learning_rate=2e-5,
    eval_strategy="epoch",
    save_strategy="epoch"

)
trainer=Trainer(
    model=model,
    args=args,
    train_dataset=dataset['train'],
    eval_dataset=dataset['test']
)
trainer.train()

os.makedirs("model/fake_news_model",exist_ok=True)

model.save_pretrained("model/fake_news_model")
tokenizer.save_pretrained("model/fake_news_model")

print("training completed")