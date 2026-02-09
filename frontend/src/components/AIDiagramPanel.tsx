/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useWhiteboardStore } from '@/stores/whiteboardStores'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface AIDiagramPanelProps {
  boardId: string
  onDiagramGenerated: (shapes: any[]) => void
}

export function AIDiagramPanel({ boardId, onDiagramGenerated }: AIDiagramPanelProps) {
  const [prompt, setPrompt] = useState('')
  const { aiProvider, setAIProvider, isGeneratingDiagram, setIsGeneratingDiagram, showAIPanel, setShowAIPanel } = useWhiteboardStore()

  const generateDiagram = async () => {
    if (!prompt.trim()) return

    setIsGeneratingDiagram(true)
    try {
      const response = await axios.post(`${BACKEND_URL}/api/ai/generate-diagram`, {
        prompt: prompt,
        provider: aiProvider,
        board_id: boardId,
      })

      onDiagramGenerated(response.data.shapes)
      setPrompt('')
      setShowAIPanel(false)
    } catch (error) {
      console.error('Diagram generation error:', error)
      alert('Failed to generate diagram. Please try again.')
    } finally {
      setIsGeneratingDiagram(false)
    }
  }

  if (!showAIPanel) {
    return (
      <button
        onClick={() => setShowAIPanel(true)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 font-medium flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        AI Diagram
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl w-96 border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Generate Diagram</h3>
        <button
          onClick={() => setShowAIPanel(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* AI Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Provider
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setAIProvider('claude')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                aiProvider === 'claude'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Claude
            </button>
            <button
              onClick={() => setAIProvider('openai')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                aiProvider === 'openai'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              OpenAI
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your diagram
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a flowchart showing user login process with database validation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            rows={4}
            disabled={isGeneratingDiagram}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateDiagram}
          disabled={isGeneratingDiagram || !prompt.trim()}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingDiagram ? 'Generating...' : 'Generate Diagram'}
        </button>

        {/* Example Prompts */}
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">Example prompts:</p>
          <ul className="space-y-1">
            <li>• System architecture with 3 microservices</li>
            <li>• User journey from signup to checkout</li>
            <li>• Database schema for e-commerce app</li>
          </ul>
        </div>
      </div>
    </div>
  )
}