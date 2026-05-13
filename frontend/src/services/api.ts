/// <reference types="vite/client" />
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface Block {
  index: number;
  hash: string;
  previous_hash: string;
  timestamp: string;
  data_hash: string;
}

export interface ChainStatus {
  is_valid: boolean;
  message: string;
}

export interface VerificationResult {
  verified: boolean;
  block?: Block;
  message: string;
}

export interface Certificate {
  id: string;
  file_name: string;
  file_hash: string;
  timestamp: string;
  blockchain_index: number;
  qr_code?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const proofSealService = {
  uploadFile: async (file: File): Promise<{ hash: string; block: Block }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  verifyFile: async (file: File): Promise<VerificationResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getChain: async (): Promise<Block[]> => {
    const response = await api.get('/chain');
    return response.data;
  },

  validateChain: async (): Promise<ChainStatus> => {
    const response = await api.get('/chain/validate');
    return response.data;
  },

  generateCertificate: async (fileHash: string): Promise<Certificate> => {
    const response = await api.post('/certificate', { file_hash: fileHash });
    return response.data;
  },
};
