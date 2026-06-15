from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import papers, classes

app = FastAPI(title="Socorra API", description="Backend API for Socorra Web App")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(papers.router, prefix="/api/v1/papers", tags=["Papers"])
app.include_router(classes.router, prefix="/api/v1/classes", tags=["Classes"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to Socorra API"}
