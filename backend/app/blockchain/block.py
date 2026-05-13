from datetime import datetime
import hashlib


class Block:
    def __init__(self, index, document_hash, previous_hash):
        self.index = index
        self.timestamp = str(datetime.utcnow())
        self.document_hash = document_hash
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        data = f"{self.index}{self.timestamp}{self.document_hash}{self.previous_hash}"
        return hashlib.sha256(data.encode()).hexdigest()

    def to_dict(self):
        return self.__dict__