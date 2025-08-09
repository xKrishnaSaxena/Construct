import os, json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env file")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI(
    title="PromptCraft MVP API",
    description="API for generating optimized prompts for LLMs.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    use_case: str

class GeneratedPrompt(BaseModel):
    persona: str
    task: str
    context: str
    format: str
    constraints: str

class PromptResponse(BaseModel):
    structured_prompt: GeneratedPrompt

META_PROMPT = """
You are an expert-level AI Prompt Engineer named 'PromptCraft'. Your sole function is to generate a detailed, structured, and optimized prompt for another AI model based on a user's simple use case.

When you receive a use case, you MUST generate a prompt in a structured JSON format. The JSON object must contain exactly these five keys: "persona", "task", "context", "format", "constraints".

- persona: Define the persona the AI should adopt.
- task: Clearly and concisely state the primary objective.
- context: Provide background with [User to insert ...] placeholders.
- format: Specify the exact output format.
- constraints: Define the rules and limitations.

Analyze the following user use case and generate the structured JSON output. Do NOT include any other text or explanations outside of the JSON object.

USER USE CASE:
"""

@app.post("/generate-prompt", response_model=PromptResponse)
async def generate_prompt(request: PromptRequest):
    if not request.use_case.strip():
        raise HTTPException(status_code=400, detail="Use case cannot be empty.")

    full_prompt = f'{META_PROMPT}"{request.use_case}"'
    try:
        generation_config = genai.types.GenerationConfig(
            response_mime_type="application/json"
        )
        resp = await model.generate_content_async(full_prompt, generation_config=generation_config)

        try:
            data = json.loads(resp.text)
        except json.JSONDecodeError:
            raise HTTPException(status_code=502, detail="Model returned invalid JSON.")

        
        required_keys = {"persona", "task", "context", "format", "constraints"}
        if set(data.keys()) != required_keys:
            raise HTTPException(status_code=502, detail="Model JSON missing required keys.")

        return {"structured_prompt": data}

    except HTTPException:
        raise
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate prompt from the model.")

@app.get("/")
def read_root():
    return {"status": "PromptCraft API is running!"}
