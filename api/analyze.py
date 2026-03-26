import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from transformers import pipeline
from functools import lru_cache
import anthropic

# App setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load sentiment model (fast)
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

# Claude client
client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

class TextInput(BaseModel):
    text: str


# ⚡ Cache sentiment (huge speed boost)
@lru_cache(maxsize=1000)
def cached_sentiment(text: str):
    return sentiment_pipeline(text)[0]


# ⚡ Claude emotional response
def generate_empathy(text: str, label: str):
    try:
        if label == "NEGATIVE":
            system_prompt = "You are a kind, empathetic assistant. Respond emotionally and supportively."
        else:
            system_prompt = "You are a cheerful assistant. Respond positively and encouragingly."

        message = client.messages.create(
            model="claude-3-haiku-20240307",  # ⚡ fastest model
            max_tokens=60,
            temperature=0.7,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": f"User said: {text}\nRespond naturally in 1-2 sentences."
                }
            ]
        )

        return message.content[0].text.strip()

    except Exception as e:
        print("Claude Error:", e)
        return fallback_response(label)


# 🔁 fallback (never let UI hang)
def fallback_response(label):
    if label == "NEGATIVE":
        return "That sounds difficult. I'm here with you."
    return "That’s really nice to hear 😊"


@app.get("/")
def root():
    return {"status": "API running"}


@app.post("/analyze")
async def analyze(input: TextInput):
    text = input.text[:512]

    # Run sentiment + Claude in parallel style
    sentiment_result = await run_in_threadpool(cached_sentiment, text)

    response_text = await run_in_threadpool(
        generate_empathy,
        text,
        sentiment_result["label"]
    )

    return {
        "label": sentiment_result["label"],
        "score": round(sentiment_result["score"], 4),
        "response": response_text
    }