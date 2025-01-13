import { Injectable } from '@nestjs/common'
import { OpenAI } from 'openai'

@Injectable()
export class OpenaiService {
	private readonly openai = new OpenAI()

	constructor() {
		this.openai.apiKey = process.env.OPENAI_API_KEY
	}

	async generateAnswer() {
		try {
			const prompt = ''
			const answer = await this.openai.chat.completions.create({
				messages: [
					{
						role: 'system',
						content: prompt
					}
				],
				model: 'gpt-4'
			})
			return answer.choices[0].message.content
		} catch (error) {
			console.log(error)
			throw new Error('openai/generate-answer-failed')
		}
	}
}
