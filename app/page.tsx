'use client'

import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    setOutput('')

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      if (data.success) {
        setOutput(data.prompt)
      } else {
        setOutput(`エラー: ${data.error}`)
      }
    } catch {
      setOutput('通信エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent
      handleSubmit(syntheticEvent)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            PromptCraft
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            Stable Diffusion プロンプト生成支援
          </p>
          <div className="mt-4 text-xs text-gray-500 bg-gray-800 rounded-lg p-3">
            💡 <strong>使い方:</strong> 単語入力でコンパクト、文章入力で詳細な結果が得られます
          </div>
        </header>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
            <div className="mb-4">
              <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
                プロンプトについて質問してください
              </label>
              <textarea
                id="prompt-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical text-white placeholder-gray-400 text-sm sm:text-base"
                rows={3}
                placeholder="例: 女性、巨乳、悩んでる顔、走ってるなど記入してください&#10;&#10;Enterで送信、Shift+Enterで改行"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              {isLoading ? '生成中...' : 'プロンプト生成'}
            </button>
          </form>

          {output && (
            <div className="mt-4 sm:mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                <h3 className="font-semibold text-base sm:text-lg text-gray-200">生成結果:</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="text-sm bg-gray-600 hover:bg-gray-500 text-gray-200 px-3 py-1 rounded transition-colors self-start sm:self-auto"
                >
                  📋 コピー
                </button>
              </div>
              <div className="p-3 sm:p-4 bg-gray-700 rounded-md border border-gray-600 overflow-x-auto">
                <pre className="whitespace-pre-wrap text-xs sm:text-sm font-mono leading-relaxed text-gray-200">{output}</pre>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-6 sm:mt-8 text-gray-400 text-xs sm:text-sm">
          <p>Stable Diffusion用プロンプト生成に特化したAIアシスタント</p>
          <p className="mt-1 text-gray-500">Created for FANZA content creators</p>
        </footer>
      </div>
    </div>
  )
}
