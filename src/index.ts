import { InferenceClient } from '@huggingface/inference'
import type { RepoId } from '@huggingface/hub'
import dotenv from 'dotenv'
import { createInterface } from 'readline'

dotenv.config()

const ACCESS_TOKEN = process.env.ACCESS_TOKEN

if (!ACCESS_TOKEN) {
  throw new Error('ACCESS_TOKEN is not set')
}

const client = new InferenceClient(ACCESS_TOKEN)
const modelName = 'meta-llama/Llama-3.1-8B-Instruct'
const repo: RepoId = { name: modelName, type: 'model' }

const consoleInputOutput = async (): Promise<string> => {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    readline.question('Digite sua mensagem: ', (input: string) => {
      readline.close()
      resolve(input)
    })
  })
}

const execute = async () => {
  // const input = await consoleInputOutput()

  // Chat completion API
  const out = await client.chatCompletionStream({
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    messages: [{ role: 'user', content: 'Hello, nice to meet you!' }],
    max_tokens: 512,
    temperature: 0.7,
    provider: 'auto',
  })

  for await (const chunk of out) {
    console.log(chunk.choices[0].delta.content)
  }
}

execute()
