import json
import os
import threading
import hashlib
from app.blockchain.block import Block
from app.storage import STORAGE_FILE


class Blockchain:
    def __init__(self):
        self._lock = threading.Lock()
        self.chain = self.load_chain()

        if len(self.chain) == 0:
            genesis = Block(0, "GENESIS", "0")
            self.chain.append(genesis.to_dict())
            self.save_chain()

    def add_block(self, document_hash):
        with self._lock:
            last_block = self.chain[-1]

            new_block = Block(
                index=len(self.chain),
                document_hash=document_hash,
                previous_hash=last_block["hash"]
            )

            self.chain.append(new_block.to_dict())
            self.save_chain()

            return new_block

    def get_chain(self):
        with self._lock:
            return self.chain

    def find_document(self, document_hash):
        with self._lock:
            for block in self.chain:
                if block["document_hash"] == document_hash:
                    return block
            return None

    def is_chain_valid(self):
        with self._lock:
            for i in range(1, len(self.chain)):
                current = self.chain[i]
                previous = self.chain[i-1]

                # 1. Verify stored hash matches recalculated hash
                recalculated_hash = self._calculate_hash_from_dict(current)
                if current["hash"] != recalculated_hash:
                    return False, f"Block {i} has been tampered with (hash mismatch)"

                # 2. Verify link to previous block
                if current["previous_hash"] != previous["hash"]:
                    return False, f"Block {i} has invalid previous_hash"

            return True, "Blockchain integrity is intact"

    def _calculate_hash_from_dict(self, block_dict):
        # We must re-calculate hash using the same formula as in Block class
        data = f"{block_dict['index']}{block_dict['timestamp']}{block_dict['document_hash']}{block_dict['previous_hash']}"
        return hashlib.sha256(data.encode()).hexdigest()

    def save_chain(self):
        # Atomic save: Write to temp file then rename
        temp_file = f"{STORAGE_FILE}.tmp"
        with open(temp_file, "w") as f:
            json.dump(self.chain, f, indent=4)
        os.replace(temp_file, STORAGE_FILE)

    def load_chain(self):
        try:
            with open(STORAGE_FILE, "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []