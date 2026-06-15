import openpyxl
from io import BytesIO
from typing import Dict, List, Any

class ExcelParserService:
    def parse_deped_roster(self, file_bytes: bytes) -> Dict[str, Any]:
        """
        Parses a DepEd E-Class Record Excel file to extract the subject,
        grade section, and the list of male and female learners.
        """
        try:
            workbook = openpyxl.load_workbook(filename=BytesIO(file_bytes), data_only=True)
            # Assuming data is in the first sheet, often named 'WW' or similar
            sheet = workbook.active

            # In DepEd templates, these are usually at the top part of the sheet.
            # We will use some common cell coordinates (you may need to adjust these
            # based on your exact template version).
            grade_section = sheet["B5"].value or "Unknown Section"
            subject = sheet["B6"].value or "Unknown Subject"

            males: List[str] = []
            females: List[str] = []
            
            # The roster typically starts somewhere underneath "LEARNERS' NAMES"
            # It usually separates MALE from FEMALE with header rows.
            current_gender = None
            
            # We'll scan a typical name column (usually B or C) from row 10 downwards.
            # Adjust the column letter and starting row if your template is shifted.
            for row in range(10, 100): 
                cell_value = sheet[f"B{row}"].value
                
                if not cell_value:
                    continue
                    
                cell_str = str(cell_value).strip()
                
                # Detect group headers
                if cell_str.upper() == "MALE":
                    current_gender = "MALE"
                    continue
                elif cell_str.upper() == "FEMALE":
                    current_gender = "FEMALE"
                    continue
                
                # If we have a name and know the gender, append it
                if current_gender == "MALE":
                    males.append(cell_str)
                elif current_gender == "FEMALE":
                    females.append(cell_str)

            return {
                "success": True,
                "grade_section": grade_section,
                "subject": subject,
                "males": males,
                "females": females
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
