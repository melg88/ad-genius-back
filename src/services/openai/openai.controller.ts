import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { GenerateAdDto } from './generate-ad.dto'; // Importe o DTO

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('generate-ad')
  async generateAdContent(@Body() generateAdDto: GenerateAdDto) {
    const { productName, targetAudience, keyFeatures } = generateAdDto;

    // Chama o serviço para gerar conteúdo
    return await this.openaiService.generateAdContent(
      productName,
      targetAudience,
      keyFeatures,
    );
  }
}
