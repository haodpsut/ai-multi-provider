
import React from 'react';
import { Provider, ProviderConfig, ApiResponse, ModelType, Model } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorIcon, SuccessIcon, InfoIcon } from './icons/StatusIcons';

interface ProviderCardProps {
  provider: Provider;
  config: ProviderConfig;
  response: ApiResponse;
  onConfigChange: (newConfig: Partial<ProviderConfig>) => void;
  isImageUploaded: boolean;
}

const ResponseDisplay: React.FC<{ response: ApiResponse }> = ({ response }) => {
    if (response.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-base-content-secondary">
                <LoadingSpinner />
                <p className="mt-4 text-sm animate-pulse-fast">Generating...</p>
            </div>
        );
    }

    if (response.error) {
        return (
            <div className="p-4 bg-red-900/30 rounded-lg text-red-300">
                <div className="flex items-start space-x-2">
                    <ErrorIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Error</p>
                        <p className="text-sm break-words">{response.error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (response.imageUrl) {
        return (
            <div className="p-2 bg-black/20 rounded-lg">
                <img src={response.imageUrl} alt="Generated" className="rounded-md w-full object-contain" />
            </div>
        );
    }
    
    if (response.text) {
        return (
             <div className="space-y-4">
                <div className="p-4 bg-black/20 rounded-lg whitespace-pre-wrap break-words text-base-content leading-relaxed">
                    {response.text}
                </div>
                {response.citations && response.citations.length > 0 && (
                     <div className="p-4 bg-blue-900/30 rounded-lg">
                         <div className="flex items-start space-x-2">
                             <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-300" />
                             <div>
                                 <p className="font-bold text-blue-200">Sources</p>
                                 <ul className="mt-2 list-disc list-inside space-y-1">
                                     {response.citations.map((cite, index) => (
                                         <li key={index} className="text-sm">
                                             <a href={cite.uri} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline truncate">
                                                 {cite.title || cite.uri}
                                             </a>
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                         </div>
                     </div>
                )}
             </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-full min-h-[200px] text-base-content-secondary">
            <p>Response will appear here</p>
        </div>
    );
};

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, config, response, onConfigChange, isImageUploaded }) => {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onConfigChange({ selectedModel: e.target.value });
  };
  
  const availableModels = provider.models.filter(model => {
      if (!isImageUploaded) return true;
      if (!provider.isVisionSupported) return false;
      if (provider.id === 'fireworks') return model.id.includes('firellava');
      if (provider.id === 'gemini') return true; // Gemini model supports vision
      if (provider.id === 'openrouter') return model.id.includes('google/gemini'); // OpenRouter vision model
      return false;
  });

  return (
    <div className={`flex flex-col bg-base-200 rounded-xl shadow-lg transition-all duration-300 ${config.isEnabled ? 'opacity-100' : 'opacity-50'}`}>
        <div className="p-4 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {provider.logo}
                    <h3 className="text-lg font-bold text-base-content">{provider.name}</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={config.isEnabled} onChange={(e) => onConfigChange({ isEnabled: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-base-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                </label>
            </div>
        </div>

        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor={`${provider.id}-model`} className="block text-sm font-medium text-base-content-secondary mb-1">Model</label>
                     <select
                        id={`${provider.id}-model`}
                        value={config.selectedModel}
                        onChange={handleModelChange}
                        disabled={!config.isEnabled || availableModels.length === 0}
                        className="w-full bg-base-300 border-base-300 text-base-content rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2"
                    >
                         {availableModels.length > 0 ? (
                            availableModels.map(model => <option key={model.id} value={model.id}>{model.name}</option>)
                        ) : (
                            <option>No compatible models for vision</option>
                        )}
                    </select>
                </div>
                 <div>
                     <label htmlFor={`${provider.id}-apikey`} className="block text-sm font-medium text-base-content-secondary mb-1">API Key</label>
                     <input
                        type="password"
                        id={`${provider.id}-apikey`}
                        value={config.apiKey}
                        onChange={(e) => onConfigChange({ apiKey: e.target.value })}
                        disabled={!config.isEnabled}
                        placeholder="Enter API Key"
                        className="w-full bg-base-300 border-base-300 text-base-content rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2 placeholder-base-content-secondary/50"
                    />
                </div>
            </div>
        </div>

        <div className="p-4 flex-grow">
            <ResponseDisplay response={response} />
        </div>
    </div>
  );
};

