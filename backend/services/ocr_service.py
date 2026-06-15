import json
import re
from PIL import Image
import io
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

# We recommend using python-dotenv and keeping this in a .env file
API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")

def process_answer_sheet(image_bytes: bytes, num_items: int, num_cols: int) -> dict:
    image = Image.open(io.BytesIO(image_bytes))
    client = genai.Client(api_key=API_KEY)
    
    PROMPT = f"""
You are reading a student MCQ answer sheet handwritten on ruled notebook paper.

Your job is to extract ALL of the following with full accuracy:
1. The student's full name (written at the top of the paper)
2. The section or grade level (written below the name)
3. The activity name (quiz name, test name, or exercise name)
4. Every single MCQ answer from item 1 to item {num_items}
   — each item number paired with its letter: A, B, C, or D

Reading rules:
- Read every item number carefully. Do not skip any.
- The sheet has {num_cols} columns of answers side by side.
- Each answer is a single capital letter: A, B, C, or D.
- If you genuinely cannot read a particular answer, use "?" for that item.
- Answer values must ONLY be: A, B, C, D, or ?
- Do not guess randomly — if unsure, use "?".

Output rules:
- Return ONLY a valid JSON object.
- No explanation, no markdown code fences, no extra text before or after.
- Use exactly this format:

{{
  "name": "full name exactly as written",
  "section": "section or grade exactly as written",
  "activity": "activity name exactly as written",
  "answers": {{
    "1": "A",
    "2": "B",
    "...": "...",
    "{num_items}": "D"
  }}
}}
"""
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[image, PROMPT]
    )
    
    raw_text = response.text.strip()
    raw_text = re.sub(r'^```(?:json)?\s*', '', raw_text)
    raw_text = re.sub(r'\s*```$', '', raw_text)
    raw_text = raw_text.strip()

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError:
        raise ValueError("Gemini did not return valid JSON.")

    return data
