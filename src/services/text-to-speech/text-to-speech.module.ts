import { Global, Module } from '@nestjs/common'
import { TextToSpeechService } from './text-to-speech.service'

@Global()
@Module({
	providers: [TextToSpeechService],
	exports: [TextToSpeechService]
})
export class TextToSpeechModule {}