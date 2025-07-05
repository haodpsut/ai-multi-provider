
import React from 'react';
import { Provider, ProviderId, ModelType } from './types';
import { GeminiIcon, OpenRouterIcon, NovitaIcon, FireworksIcon } from './components/icons/ProviderIcons';

export const PROVIDERS: Provider[] = [
  {
    id: ProviderId.GEMINI,
    name: 'Google Gemini',
    logo: <GeminiIcon />,
    isVisionSupported: true,
    models: [
      { id: 'gemini-2.5-flash-preview-04-17', name: 'Gemini 2.5 Flash', type: ModelType.TEXT },
    ],
  },
  {
    id: ProviderId.OPENROUTER,
    name: 'OpenRouter',
    logo: <OpenRouterIcon />,
    isVisionSupported: true,
    models: [
      { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', type: ModelType.TEXT },
      { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', type: ModelType.TEXT },
      { id: 'google/gemma-7b-it:free', name: 'Gemma 7B (Free)', type: ModelType.TEXT },
      { id: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo', name: 'Nous Hermes 2 Mixtral', type: ModelType.TEXT },
    ],
  },
  {
    id: ProviderId.NOVITA,
    name: 'Novita AI',
    logo: <NovitaIcon />,
    isVisionSupported: false,
    models: [
      { id: 'sd_xl_base_1.0_url.json', name: 'Stable Diffusion XL 1.0', type: ModelType.IMAGE },
      { id: 'dall-e-3_url.json', name: 'DALL-E 3', type: ModelType.IMAGE },
      { id: 'Unstable_Diffusers_v10_url.json', name: 'Unstable Diffusers v10', type: ModelType.IMAGE },
    ],
  },
  {
    id: ProviderId.FIREWORKS,
    name: 'Fireworks AI',
    logo: <FireworksIcon />,
    isVisionSupported: true,
    models: [
      { id: 'accounts/fireworks/models/firellava-13b', name: 'FireLLaVA 13B (Vision)', type: ModelType.TEXT },
      { id: 'accounts/fireworks/models/mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', type: ModelType.TEXT },
      { id: 'accounts/fireworks/models/stable-diffusion-xl-base-1.0', name: 'Stable Diffusion XL', type: ModelType.IMAGE },
    ],
  },
];
