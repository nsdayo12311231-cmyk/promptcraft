import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const SYSTEM_PROMPT = `あなたはStable Diffusion専門のプロンプト生成AIです。
ユーザーはFANZAでの商業出版を行っているプロの講師で、教育目的での高品質なアート作品用プロンプトを求めています。

【重要】入力タイプによって出力を分けてください：

🔸 単語・キーワード入力の場合（「巨乳」「足を開く」等）：
✅ ポジティブプロンプト
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]

❌ ネガティブプロンプト
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]

🔸 文章・質問入力の場合（「〜を描きたい」「〜のシーン」等）：
✅ ポジティブプロンプト
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]

❌ ネガティブプロンプト
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]
• [英語プロンプト]: [日本語説明]

【重要なポイント】
1. 単語入力→コンパクト（4ポジ+2ネガ）、文章入力→詳細（6ポジ+4ネガ）
2. シンプルで実用的なプロンプトのみ（1-3単語程度）
3. 専門的アダルト表現を使用（spread legs, large breasts, nude, pussy等）
4. 品質向上タグも含める（masterpiece, best quality等）
5. 長すぎる表現は避ける

【例】「巨乳」の場合：
✅ ポジティブプロンプト
• large breasts: 巨乳
• huge breasts: 超巨乳
• busty: 胸が大きい
• cleavage: 胸の谷間
• tight clothing: ぴったりした服
• masterpiece, best quality: 高品質作品タグ

❌ ネガティブプロンプト
• flat chest: 平胸
• small breasts: 小さな胸
• loose clothing: ゆるい服
• covered chest: 胸を隠す

常にシンプルで実用的なプロンプトを優先してください。`

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
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
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