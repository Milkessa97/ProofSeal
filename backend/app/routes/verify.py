from fastapi import APIRouter, UploadFile, File, Request
from app.services.hasher import hash_file

router = APIRouter()


@router.post("/verify")
async def verify(request: Request, file: UploadFile = File(...)):
    # Access the shared blockchain instance from app state
    blockchain = request.app.state.blockchain
    
    file_bytes = await file.read()
    doc_hash = hash_file(file_bytes)

    block = blockchain.find_document(doc_hash)

    if block:
        # Ensure block dict has data_hash for frontend
        block_dict = dict(block)
        block_dict['data_hash'] = block_dict.get('document_hash')
        
        return {
            "verified": True,
            "message": "Document authenticated via blockchain fingerprint.",
            "block": block_dict
        }

    return {
        "verified": False,
        "message": "Cryptographic mismatch: Document not found in ledger."
    }