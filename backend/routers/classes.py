from fastapi import APIRouter, UploadFile, File, HTTPException
from services.excel_service import ExcelParserService

router = APIRouter()

@router.post("/upload-excel")
async def upload_excel_roster(file: UploadFile = File(...)):
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="Only .xlsx files are supported")
        
    contents = await file.read()
    
    excel_service = ExcelParserService()
    result = excel_service.parse_deped_roster(contents)
    
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error"))
        
    return result
