from fastapi import APIRouter, UploadFile, File, Request, HTTPException
from app.services.hasher import hash_file

router = APIRouter()


@router.post("/upload")
async def upload(request: Request, file: UploadFile = File(...)):
    # Access the shared blockchain instance from app state
    blockchain = request.app.state.blockchain
    
    file_bytes = await file.read()
    doc_hash = hash_file(file_bytes)

    # Check if document already exists on the chain
    existing_block = blockchain.find_document(doc_hash)
    if existing_block:
        # Instead of erroring, we return the existing block with a message
        # This is more user-friendly for a "Proof of Existence" system
        block_dict = dict(existing_block)
        block_dict['data_hash'] = block_dict.get('document_hash')
        return {
            "hash": doc_hash,
            "block": block_dict,
            "message": "Document already sealed in the blockchain.",
            "is_duplicate": True
        }

    # Add new block if unique
    block = blockchain.add_block(doc_hash)
    block_dict = block.to_dict()
    block_dict['data_hash'] = block_dict.get('document_hash')

    return {
        "hash": doc_hash,
        "block": block_dict,
        "message": "Document successfully sealed.",
        "is_duplicate": False
    }