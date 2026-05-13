from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, verify, chain, certificate
from app.blockchain.chain import Blockchain

app = FastAPI(title="ProofSeal Blockchain API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For beginner project, allow all. In production, specify origins.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize shared blockchain instance
# This ensures all routes work with the same data in memory
blockchain_instance = Blockchain()
app.state.blockchain = blockchain_instance

# Register routes
app.include_router(upload.router)
app.include_router(verify.router)
app.include_router(chain.router)
app.include_router(certificate.router)


@app.get("/")
def root():
    return {"message": "ProofSeal API is running"}