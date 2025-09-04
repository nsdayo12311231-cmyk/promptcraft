import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const SYSTEM_PROMPT = `Stable Diffusion専門プロンプト生成AI。FANZA向け高品質アート用。

入力別出力：
【単語】→4ポジ+2ネガ
【文章】→6ポジ+4ネガ

形式：
✅ポジティブ
• 英語: 日本語
• 英語: 日本語

❌ネガティブ  
• 英語: 日本語
• 英語: 日本語

ルール：
・1-3単語で簡潔
・専門用語使用(large breasts, spread legs等)
・品質タグ含む(masterpiece, best quality)

例「巨乳」:
✅large breasts: 巨乳
✅huge breasts: 超巨乳
✅masterpiece: 高品質
❌flat chest: 平胸`

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'メッセージが提供されていません' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      max_tokens: 200,
      temperature: 0.3,
    })

    const result = completion.choices[0]?.message?.content

    if (!result) {
      throw new Error('AIからの応答が空です')
    }

    return NextResponse.json({
      prompt: result,
      success: true
    })

  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'プロンプト生成中にエラーが発生しました',
        success: false 
      },
      { status: 500 }
    )
  }
}