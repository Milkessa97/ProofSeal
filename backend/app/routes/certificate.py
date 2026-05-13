from fastapi import APIRouter, UploadFile, File, Request
from app.services.hasher import hash_file
import uuid

router = APIRouter()


@router.post("/certificate")
async def certificate(request: Request, file: UploadFile = File(...)):
    # Access the shared blockchain instance from app state
    blockchain = request.app.state.blockchain
    
    file_bytes = await file.read()
    doc_hash = hash_file(file_bytes)

    block = blockchain.find_document(doc_hash)

    if not block:
        return {
            "success": False,
            "message": "No proof found for this document"
        }

    # Format specifically for the frontend Certificate interface
    return {
        "id": str(uuid.uuid4()),
        "file_name": file.filename,
        "file_hash": doc_hash,
        "timestamp": block["timestamp"],
        "blockchain_index": block["index"],
        "qr_code": f"PROOFSEAL-{doc_hash[:8]}" # Placeholder QR content
    }