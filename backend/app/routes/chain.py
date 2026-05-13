from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/chain")
def get_chain(request: Request):
    blockchain = request.app.state.blockchain
    chain_data = blockchain.get_chain()
    
    # Map for frontend compatibility
    formatted_chain = []
    for block in chain_data:
        b = dict(block)
        b['data_hash'] = b.get('document_hash')
        formatted_chain.append(b)
        
    return formatted_chain


@router.get("/chain/validate")
def validate_chain(request: Request):
    blockchain = request.app.state.blockchain
    is_valid, message = blockchain.is_chain_valid()
    return {
        "is_valid": is_valid,
        "message": message
    }