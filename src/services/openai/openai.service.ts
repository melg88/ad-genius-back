import { Injectable } from '@nestjs/common'
import { OpenAI } from 'openai'
import { promises as fs } from 'fs'

@Injectable()
export class OpenaiService {
	private readonly openai = new OpenAI()

	constructor() {
		this.openai.apiKey = process.env.OPENAI_API_KEY
	}

	private async generateCompletion(messages: any[]): Promise<string> {
		try {
			const response = await this.openai.chat.completions.create({
				model: 'gpt-4-turbo',
				response_format: { type: 'json_object' },
				messages
			})

			return response.choices[0].message.content.trim()
		} catch (error) {
			console.error('Error generating response from OpenAI:', error)
			throw new Error('openai/generate-completion-failed')
		}
	}

	async generateAdContent(
		productName: string,
		targetAudience: string,
		imageUrl: string
	): Promise<{
		title: string
		description: string
		hashtags: string[]
		caption: string
	}> {
		const messages = [
			{
				role: 'system',
				content:
					'You are an AI assistant specialized in creating engaging ads based on images and audience insights.'
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: `Analise esta imagem e crie um anúncio otimizado para redes sociais com base no seguinte produto e público-alvo:
            
            - **Nome do Produto**: ${productName}
            - **Público-Alvo**: ${targetAudience}
            
            Retorne **exclusivamente** um JSON **válido** com os seguintes campos, sem qualquer outro texto adicional antes ou depois do JSON:
            {
              "title": "Título do anúncio",
              "caption: "Texto do anúncio que será falado no vídeo de divulgação do produto. O texto deve  ter cerca de 30 segundos de duração e ser otimizado para engajar o público alvo, utilizando a linguagem deles na internet.",
              "description": "Descrição detalhada e persuasiva do produto, incluindo benefícios e diferenciais, utilize um texto que dialogue com o público alvo.",
              "hashtags": ["Lista de hashtags populares e relevantes"]
            }

            A descrição deve ser envolvente, destacando os diferenciais do produto e incentivando a compra. 
            As hashtags devem ser estratégicas para aumentar o alcance da publicação.
            `
					},
					{ type: 'image_url', image_url: { url: imageUrl } }
				]
			}
		]

		const response = await this.generateCompletion(messages)
		const respondeData = JSON.parse(response) as {
			title: string
			description: string
			hashtags: string[]
			caption: string
		}

		try {
			return {
				title: respondeData.title,
				description: respondeData.description,
				hashtags: respondeData.hashtags,
				caption: respondeData.caption
			}
		} catch (error) {
			console.error('Error parsing OpenAI response:', response)
			throw new Error('openai/invalid-json-response')
		}
	}

	async generateAudio(caption: string, id: string): Promise<string> {
		try {
			const response = await this.openai.audio.speech.create({
				model: 'tts-1',
				input: caption,
				voice: 'echo'
			})

			const audioBuffer = Buffer.from(await response.arrayBuffer())
			/*const audioDir = join(__dirname, '..','..', 'uploads', 'audios');
      if (!existsSync(audioDir)) {
        await mkdir(audioDir, { recursive: true });
      }
      const filePath = join(audioDir, fileName);*/
			//const writeFile = util.promisify(fs.writeFile)
			const fileName = `audio-${id}.mp3`

			await fs.writeFile(fileName, audioBuffer, 'binary')

			return `${fileName}`
		} catch (error) {
			console.error('Error generating audio:', error)
			throw new Error('openai/generate-audio-failed')
		}
	}
}
