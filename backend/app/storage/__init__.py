import os

# Base directory of the project
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path to the blockchain JSON file
STORAGE_FILE = os.path.join(BASE_DIR, "chain.json")
