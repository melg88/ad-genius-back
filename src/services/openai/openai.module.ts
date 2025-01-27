import { Global, Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';

@Global()
@Module({
  providers: [OpenaiService], // Registra o serviço
  controllers: [OpenaiController], // Registra o controlador
  exports: [OpenaiService] // Permite que outros módulos usem o serviço
})
export class OpenaiModule {}
