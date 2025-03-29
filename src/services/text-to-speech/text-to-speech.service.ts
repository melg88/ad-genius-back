import textToSpeech from '@google-cloud/text-to-speech'
import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as util from 'util'
import { createCredentialsJsonFromEnv } from './credentials'

@Injectable()
export class TextToSpeechService {
	private readonly client

	constructor() {
		createCredentialsJsonFromEnv()
		this.client = new textToSpeech.TextToSpeechClient({
			options: {
				credentials: 'credentials.json'
			}
		})
	}

	async generateAudio(text: string, id: string) {
		try {
			const request = {
				input: { text: text },
				voice: {
					languageCode: 'pt-BR',
					name: 'pt-BR-Wavenet-A',
					ssml_gender: 'NEUTRAL'
				},
				audioConfig: { audioEncoding: 'MP3' }
			}
			const [response] = await this.client.synthesizeSpeech(request)
			const writeFile = util.promisify(fs.writeFile)
			await writeFile(`${id}.mp3`, response.audioContent, 'binary')
			console.log(`Audio content written to file: ${id}.mp3.mp3`)
			return `${id}.mp3`
		} catch (error) {
			console.error(error)
			throw new Error('text-to-speech/generate-audio-failed')
		}
	}
}