'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading?: boolean;
}

export default function PromptInput({ onGenerate, isLoading = false }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    } else {
      toast.error('Please enter a description');
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Voice input would be implemented here with Web Speech API
    toast.info('Voice input feature coming soon!');
  };

  const examplePrompts = [
    'A delicate rose gold ring with small diamonds',
    'Bold statement necklace with emerald centerpiece',
    'Minimalist silver bracelet with geometric patterns',
    'Vintage-style sapphire earrings',
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your dream jewelry... (e.g., 'A delicate gold necklace with a heart-shaped diamond pendant')"
            rows={4}
            disabled={isLoading}
            className="w-full px-6 py-4 pr-32 rounded-2xl border-2 border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:border-violet-500 dark:focus:border-violet-400
                     resize-none transition-all duration-200 disabled:opacity-50"
          />

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <motion.button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={`p-3 rounded-xl transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              } disabled:opacity-50`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            <Button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              variant="primary"
              icon={isLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            >
              Generate
            </Button>
          </div>
        </div>
      </form>

      {/* Example Prompts */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Try these examples:
        </p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <motion.button
              key={index}
              onClick={() => setPrompt(example)}
              disabled={isLoading}
              className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 
                       text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30
                       hover:text-violet-600 dark:hover:text-violet-400 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

