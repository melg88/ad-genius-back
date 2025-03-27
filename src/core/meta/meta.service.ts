import { AdRepository } from '@core/ad/ad.repository'
import { Inject, Injectable } from '@nestjs/common'
import axios from 'axios'


@Injectable()
export class MetaService {
    private clientId: string
    private clientSecret: string
    private redirectUri: string

    constructor(@Inject(AdRepository) protected adRepository: AdRepository,) {
        this.clientId = process.env.INSTAGRAM_CLIENT_ID;
        this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
        this.redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
    }

    async callback(code: string) {
      const tokenResponse = await axios.post(`https://api.instagram.com/oauth/access_token`, null, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
          code,
        },
      });

      const accessToken = tokenResponse.data.access_token;
      const userId = tokenResponse.data.user_id;

      const userResponse = await axios.get(`https://graph.instagram.com/${userId}`, {
        params: {
          fields: 'id,username,account_type',
          access_token: accessToken,
        },
      });
      return {data: userResponse.data, token: accessToken}
    }

    async getInstagramAccount( accessToken: string) {
        const url = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`;
    
        const response = await axios.get(url);
        return response.data;
      }

    async postToInstagram(accessToken: string,  accountId: string, adId: string) {
    
        const createMediaUrl = `https://graph.facebook.com/v18.0/${accountId}/media`;
        const ad = await this.adRepository.findOneById(adId);
        if (!ad) {
            throw new Error('ad/not-found');
        }
        const mediaResponse = await axios.post(createMediaUrl, null, {
          params: {
            image_url: ad.imageUrl,
            caption: ad.description,
            access_token: accessToken,
          },
        });
    
        const mediaId = mediaResponse.data.id;
    
        const publishUrl = `https://graph.facebook.com/v18.0/${accountId}/media_publish`;
        const publishResponse = await axios.post(publishUrl, null, {
          params: {
            creation_id: mediaId,
            access_token: accessToken,
          },
        });
    
        return publishResponse.data;
      }
}
