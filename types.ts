
export enum ProviderId {
  GEMINI = 'gemini',
  OPENROUTER = 'openrouter',
  NOVITA = 'novita',
  FIREWORKS = 'fireworks',
}

export enum ModelType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export interface Model {
  id: string;
  name: string;
  type: ModelType;
}

export interface Provider {
  id: ProviderId;
  name: string;
  logo: React.ReactNode;
  models: Model[];
  isVisionSupported: boolean;
}

export interface ProviderConfig {
  isEnabled: boolean;
  apiKey: string;
  selectedModel: string;
}

export interface ApiResponse {
  isLoading: boolean;
  text?: string;
  imageUrl?: string;
  error?: string;
  citations?: { uri: string; title: string }[];
}

export interface ApiServiceParams {
    apiKey: string;
    model: string;
    prompt: string;
    imageBase64?: string | null;
}
