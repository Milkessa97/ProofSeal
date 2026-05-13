# 🛡️ ProofSeal: Immutable Digital Notary


> **Seal the Unalterable.** ProofSeal is a high-fidelity document verification protocol that leverages blockchain technology to provide cryptographic proof of existence and integrity.

---

## 🌟 The Vision

In an era of rapid digital manipulation and AI-generated content, the ability to prove that a specific document existed at a specific point in time—and has not been altered since—is becoming a fundamental necessity. 

**ProofSeal** serves as a "Digital Notary" that is:

*   **Trustless**: You don't need to trust a central authority; the math protects you.
*   **Private**: Your documents **never leave your machine**. We only record the cryptographic "fingerprint" (hash) generated in your browser.
*   **Permanent**: Once a seal is broadcast to the ledger, it is immutable and timestamped forever.

---

## 🎨 Frontend Architecture & UX

The ProofSeal frontend is built for **speed, security, and cinematic impact**. It's not just a tool; it's an experience.

### 💎 Design System

*   **Glassmorphism**: A modern UI aesthetic using background blurs, subtle borders, and translucent layers.
*   **Dark Mode Native**: Optimized for high-contrast, low-strain environments with indigo neon accents.
*   **Scroll-Snap Storytelling**: The application is divided into "Stages" (Hero, Trust Terminal, Audit Trail) that snap into place for a seamless narrative flow.

### ⚡ Technical Excellence

*   **Local-First Hashing**: Using browser-side cryptography to ensure that file contents never reach the server, providing 100% data privacy.
*   **Real-time Feedback**: Dynamic animations using **Framer Motion** for state transitions, file drops, and validation results.
*   **Responsive Mastery**: Fully optimized for everything from 4K monitors to mobile devices, featuring adaptive layouts and fluid typography.

---

## 🚀 Key Features

### 🔐 Zero-Knowledge Sealing
Generate a SHA-256 fingerprint of any file locally. The system records the hash on the blockchain while keeping your data 100% private.

### 🔍 Instant Verification Terminal
Drop a file into the "Trust Terminal" to instantly compare its current state against the global ledger. Detect even a single bit of unauthorized modification.

### 📜 Public Audit Trail (Explorer)
A transparent, real-time explorer that visualizes the blockchain growth. Each block is cryptographically linked to its predecessor, ensuring total chain integrity.

### 🎫 Cryptographic Certificates
Generate and download "Proof of Existence" certificates in plaintext format, containing the hash, block index, and official timestamp.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 + Vite |
| **Animations** | Framer Motion (motion/react) |
| **Icons** | Lucide React |
| **Backend API** | FastAPI (Python 3.9+) |
| **State Management** | React Hooks (Shared State) |
| **Blockchain** | Thread-Safe Singleton Ledger |

---

## 🏁 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 System Logic

1.  **Client-Side Hashing**: React processes the file locally to generate a SHA-256 hash.
2.  **API Propagation**: The hash is sent to the FastAPI backend.
3.  **Blockchain Persistence**: The backend validates the hash and appends it to an atomic JSON ledger.
4.  **Linkage**: Each new block includes the hash of the previous block, creating an unbreakable chain.
5.  **Integrity Monitoring**: The system continuously validates the Merkle Root of the entire chain to ensure zero tampering at the storage level.

---

## 📄 License

This project is licensed under the Apache-2.0 License.

---

<p align="center">
  Built with ❤️ for the decentralized web.
</p>
