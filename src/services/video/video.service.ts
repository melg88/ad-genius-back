import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class VideoService {
  private readonly API_URL = 'https://api.shotstack.io/edit/stage/render';
  private readonly API_KEY = process.env.SHOTSTACK_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async createVideo(imageUrl: string, audioUrl: string, title:string, price: string): Promise<string> {
    const requestBody = {
      timeline: {
        soundtrack: {
          src: audioUrl,
          effect: 'fadeOut',
        },
        tracks: [
          {
            "clips": [
          {
            "asset": {
              "type": "text",
              "text": "COMPRE AGORA",
              "alignment": {
                "horizontal": "center",
                "vertical": "center"
              },
              "font": {
                "color": "#000000",
                "family": "Montserrat ExtraBold",
                "size": "66",
                "lineHeight": 1
              },
              "width": 535,
              "height": 163,
              "background": {
                "color": "#ffffff",
                "borderRadius": 73
              },
              "stroke": {
                "color": "#ffffff",
                "width": 0
              }
            },
            "start": 1.955,
            "length": 40,
            "offset": {
              "x": 0,
              "y": 0.066
            },
            "position": "center",
            "fit": "none",
            "scale": 1,
            "transition": {
              "in": "slideUp"
            }
          }
        ]
      },
      {
        "clips": [
          {
            "length": 38,
            "asset": {
              "type": "image",
              "src": imageUrl
            },
            "start": 1.03,
            "offset": {
              "x": -0.014,
              "y": -0.188
            },
            "scale": 0.367,
            "position": "center",
            "transition": {
              "in": "slideUp"
            }
          }
        ]
      },
      {
        "clips": [
          {
            "length": 40,
            "asset": {
              "type": "image",
              "src": "https://templates.shotstack.io/grey-minimalist-product-ad/4ee059ca-2fcd-4bfe-9de9-d940238c49d4/source.png"
            },
            "start": 0,
            "offset": {
              "x": 0,
              "y": -0.344
            },
            "scale": 0.535,
            "position": "center"
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": title,
              "alignment": {
                "horizontal": "center",
                "vertical": "center"
              },
              "font": {
                "color": "#ffffff",
                "family": "Montserrat ExtraBold",
                "size": "48",
                "lineHeight": 1
              },
              "width": 800,
              "height": 422,
              "stroke": {
                "color": "#0055ff",
                "width": 0
              }
            },
            "start": 0,
            "length": 40,
            "offset": {
              "x": 0,
              "y": 0.338
            },
            "position": "center",
            "fit": "none",
            "scale": 1,
            "transition": {
              "in": "slideUpFast"
            }
          }
        ]
      },
      {
        "clips": [
          {
            "fit": "none",
            "scale": 1,
            "asset": {
              "type": "text",
              "text": price,
              "alignment": {
                "horizontal": "center",
                "vertical": "center"
              },
              "font": {
                "color": "#ffffff",
                "family": "Montserrat ExtraBold",
                "size": 46,
                "lineHeight": 1
              },
              "width": 728,
              "height": 72
            },
            "start": 0.25,
            "length": 40,
            "offset": {
              "x": 0,
              "y": 0.207
            },
            "position": "center",
            "transition": {
              "in": "slideUpFast"
            }
          }
        ]
      },
      {
        "clips": [
          {
            "length": 40,
            "asset": {
              "type": "image",
              "src": "https://templates.shotstack.io/grey-minimalist-product-ad/cfd0e601-9e06-47b7-9d3d-c79e2ae51711/source.png"
            },
            "start": 0,
            "offset": {
              "x": 0,
              "y": -0.471
            },
            "scale": 0.741,
            "position": "center"
          }
        ]
      }],
      },
      output: {
        format: 'mp4',
        size: {
          width: 1080, 
          height: 1920, 
        },
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(this.API_URL, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.API_KEY,
          },
        })
      );

      return response.data.response.id; 
    } catch (error) {
      console.error("Erro ao criar vídeo:", JSON.stringify(error.response?.data, null, 2));
      throw new HttpException(error.response?.data || 'Error creating video', error.response?.status || 500);
    }
  }


  async checkRenderStatus(renderId: string): Promise<string | null> {
    const url = `${this.API_URL}/${renderId}`;

    try {
      const response = await lastValueFrom( 
        this.httpService.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.API_KEY,
          },
        }))

      const { status, url: videoUrl } = response.data.response;
      if (status === 'done') {
        return videoUrl; 
      } else if (status === 'failed') {
        throw new HttpException('Render failed', 400);
      }
      return null; 
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error checking status', error.response?.status || 500);
    }
  }
}
