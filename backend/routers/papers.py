from fastapi import APIRouter, UploadFile, File, Form
from services.ocr_service import process_answer_sheet

router = APIRouter()

@router.post("/extract-answers")
async def extract_answers(
    file: UploadFile = File(...),
    num_items: int = Form(30),
    num_cols: int = Form(3)
):
    """
    Endpoint to receive an image of an answer sheet,
    pass it to Gemini 2.5 Flash, and return the structured data.
    """
    image_bytes = await file.read()
    result = process_answer_sheet(image_bytes, num_items, num_cols)
    return result

@router.post("/analyze-results")
def analyze_results():
    """
    Endpoint to process scores against competencies and generate insights.
    """
    pass
