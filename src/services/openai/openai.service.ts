import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openai = new OpenAI();

  constructor() {
    this.openai.apiKey = process.env.OPENAI_API_KEY;
  }

  private async generateCompletion(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant specialized in creating advertisements.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating response from OpenAI:', error);
      throw new Error('openai/generate-completion-failed');
    }
  }

  async generateAdContent(
    productName: string,
    targetAudience: string,
    keyFeatures: string[]
  ): Promise<{ title: string; description: string; hashtags: string[] }> {
    // generate title
    const titlePrompt = `Generate a catchy and engaging title for a product called "${productName}" targeted at "${targetAudience}".`;
    const title = await this.generateCompletion(titlePrompt);

    // generate description
    const descriptionPrompt = `Write a compelling description for a product called "${productName}" targeted at "${targetAudience}" highlighting the following features: ${keyFeatures.join(
      ', '
    )}.`;
    const description = await this.generateCompletion(descriptionPrompt);

    // generate hashtags
    const hashtagsPrompt = `Suggest 5 relevant and popular hashtags for a product called "${productName}" targeted at "${targetAudience}" and related to these features: ${keyFeatures.join(
      ', '
    )}. Return only the hashtags, separated by commas.`;
    const hashtagsResponse = await this.generateCompletion(hashtagsPrompt);
    const hashtags = hashtagsResponse.split(',').map((tag) => tag.trim());

    // returns json
    return {
      title,
      description,
      hashtags,
    };
  }
}
