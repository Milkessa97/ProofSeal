class Validator:
    def __init__(self, chain):
        self.chain = chain

    def is_valid(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            # Check hash link
            if current["previous_hash"] != previous["hash"]:
                return False, i

            # Recalculate hash
            recalculated = self.recalculate_hash(current)
            if current["hash"] != recalculated:
                return False, i

        return True, -1

    def recalculate_hash(self, block):
        import hashlib
        data = f"{block['index']}{block['timestamp']}{block['document_hash']}{block['previous_hash']}"
        return hashlib.sha256(data.encode()).hexdigest()