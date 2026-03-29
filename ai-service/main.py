from fastapi import FastAPI

app = FastAPI(title="CRM Service")

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "Service is running"}