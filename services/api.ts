import { CharacterizeRequest, QuantAnalyzeRequest } from '@/types/api';
import Constants from 'expo-constants';
import { ApiClient } from './http';

const API_BASE = Constants.expoConfig?.extra?.API_BASE || 'http://localhost:8000';
export const api = new ApiClient(API_BASE);

export const analyzeQuant = (payload: QuantAnalyzeRequest) => api.analyzeQuant(payload);
export const characterizeInstrument = (payload: CharacterizeRequest) => api.characterizeInstrument(payload);
export const apiHealth = () => api.health();