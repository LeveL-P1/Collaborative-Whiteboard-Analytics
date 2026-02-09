import { create } from 'zustand'

interface WhiteboardState {
  selectedTool: string
  aiProvider: 'claude' | 'openai'
  isGeneratingDiagram: boolean
  showAIPanel: boolean
  setSelectedTool: (tool: string) => void
  setAIProvider: (provider: 'claude' | 'openai') => void
  setIsGeneratingDiagram: (generating: boolean) => void
  setShowAIPanel: (show: boolean) => void
}

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  selectedTool: 'select',
  aiProvider: 'claude',
  isGeneratingDiagram: false,
  showAIPanel: false,
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setAIProvider: (provider) => set({ aiProvider: provider }),
  setIsGeneratingDiagram: (generating) => set({ isGeneratingDiagram: generating }),
  setShowAIPanel: (show) => set({ showAIPanel: show }),
}))