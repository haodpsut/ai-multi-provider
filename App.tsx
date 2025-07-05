
import React, { useState, useCallback } from 'react';
import { ProviderId, ProviderConfig, ApiResponse } from './types';
import { PROVIDERS } from './constants';
import { ProviderCard } from './components/ProviderCard';
import { InputArea } from './components/InputArea';
import { callApi } from './services/apiService';
import { Header } from './components/Header';
import { WarningIcon } from './components/icons/StatusIcons';


const initialConfigs = PROVIDERS.reduce((acc, provider) => {
  acc[provider.id] = {
    isEnabled: true,
    apiKey: '',
    selectedModel: provider.models[0].id,
  };
  return acc;
}, {} as Record<ProviderId, ProviderConfig>);

const initialResponses = PROVIDERS.reduce((acc, provider) => {
  acc[provider.id] = { isLoading: false };
  return acc;
}, {} as Record<ProviderId, ApiResponse>);


export default function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<{ file: File; base64: string } | null>(null);
  const [providerConfigs, setProviderConfigs] = useState<Record<ProviderId, ProviderConfig>>(initialConfigs);
  const [responses, setResponses] = useState<Record<ProviderId, ApiResponse>>(initialResponses);
  
  const handleConfigChange = useCallback((id: ProviderId, newConfig: Partial<ProviderConfig>) => {
    setProviderConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], ...newConfig },
    }));
  }, []);

  const handleSubmit = async () => {
    const activeProviders = PROVIDERS.filter(p => providerConfigs[p.id].isEnabled && providerConfigs[p.id].apiKey);

    if (activeProviders.length === 0) {
      alert("Please enable at least one provider and enter its API key.");
      return;
    }
    
    // Reset responses and set loading state for active providers
    setResponses(prev => {
      const newState = { ...initialResponses };
      for (const provider of activeProviders) {
        newState[provider.id] = { ...prev[provider.id], isLoading: true, error: undefined, text: undefined, imageUrl: undefined, citations: undefined };
      }
      return newState;
    });

    const imageBase64 = image ? image.base64.split(',')[1] : null;

    await Promise.allSettled(
      activeProviders.map(async provider => {
        const config = providerConfigs[provider.id];
        try {
          const result = await callApi(provider.id, {
            apiKey: config.apiKey,
            model: config.selectedModel,
            prompt: prompt,
            imageBase64: imageBase64,
          });

          setResponses(prev => ({
            ...prev,
            [provider.id]: { ...result, isLoading: false },
          }));
        } catch (error: any) {
          console.error(`Error with ${provider.name}:`, error);
          setResponses(prev => ({
            ...prev,
            [provider.id]: {
              isLoading: false,
              error: error.message || 'An unknown error occurred.',
            },
          }));
        }
      })
    );
  };

  const isAnyLoading = Object.values(responses).some(r => r.isLoading);

  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <InputArea
            prompt={prompt}
            setPrompt={setPrompt}
            image={image}
            setImage={setImage}
            onSubmit={handleSubmit}
            isLoading={isAnyLoading}
          />
          
          <div className="my-6 p-4 bg-yellow-900/20 border border-yellow-700 text-yellow-300 rounded-lg flex items-start space-x-3">
            <WarningIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
                <span className="font-bold">Security Notice:</span> Your API keys are stored in your browser's memory and are used directly from the client. This is suitable for local testing but is not secure for a publicly deployed application. Never expose this tool to the internet with saved keys.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {PROVIDERS.map(provider => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                config={providerConfigs[provider.id]}
                response={responses[provider.id]}
                onConfigChange={(newConfig) => handleConfigChange(provider.id, newConfig)}
                isImageUploaded={!!image}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
