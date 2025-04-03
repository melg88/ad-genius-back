import { AdRepository } from '@core/ad/ad.repository'
import { Inject, Injectable } from '@nestjs/common'
import axios from 'axios'
import { ContactEnum } from './dtos'

@Injectable()
export class MetaService {
	private clientId: string
	private clientSecret: string
	private redirectUri: string

	constructor(@Inject(AdRepository) protected adRepository: AdRepository) {
		this.clientId = process.env.INSTAGRAM_CLIENT_ID
		this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET
		this.redirectUri = process.env.INSTAGRAM_REDIRECT_URI
	}

	async callback(code: string) {
		const tokenResponse = await axios.post(
			`https://api.instagram.com/oauth/access_token`,
			null,
			{
				params: {
					client_id: this.clientId,
					client_secret: this.clientSecret,
					grant_type: 'authorization_code',
					redirect_uri: this.redirectUri,
					code
				}
			}
		)

		const accessToken = tokenResponse.data.access_token
		const userId = tokenResponse.data.user_id

		const userResponse = await axios.get(`https://graph.instagram.com/${userId}`, {
			params: {
				fields: 'id,username,account_type',
				access_token: accessToken
			}
		})
		return { data: userResponse.data, token: accessToken }
	}

	async getInstagramAccount(accessToken: string) {
		const url = `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`

		const response = await axios.get(url)
		return response.data
	}

	async postToInstagram(
		accessToken: string,
		accountId: string,
		adId: string,
		contacts: ContactEnum[]
	) {
		const createMediaUrl = `https://graph.facebook.com/v18.0/${accountId}/media`
		const ad = await this.adRepository.findOneById(adId)
		if (!ad) {
			throw new Error('ad/not-found')
		}
		const caption = this.formatInstagramCaption({ ...ad, contacts })
		const mediaResponse = await axios.post(createMediaUrl, null, {
			params: {
				image_url: ad.imageUrl,
				caption: caption,
				access_token: accessToken
			}
		})

		const mediaId = mediaResponse.data.id

		const publishUrl = `https://graph.facebook.com/v18.0/${accountId}/media_publish`
		const publishResponse = await axios.post(publishUrl, null, {
			params: {
				creation_id: mediaId,
				access_token: accessToken
			}
		})

		return publishResponse.data
	}

	private formatInstagramCaption(ad: {
		title: string
		description: string
		hashtags: string[]
		price: number
		contacts: ContactEnum[]
	}): string {
		const formattedPrice = new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
			minimumFractionDigits: 2
		}).format(ad.price)

		const emojis = {
			title: '✨',
			price: '💲',
			description: '📱',
			hashtags: '🏷️',
			contact: {
				BIO: '👉',
				EMAIL: '📧',
				COMMENTS: '💬',
				DM: '📥'
			}
		}

		const contactLines = ad.contacts.map((contactType) => {
			switch (contactType) {
				case ContactEnum.BIO:
					return `${emojis.contact.BIO} LINK NA BIO!`
				case ContactEnum.EMAIL:
					return `${emojis.contact.EMAIL} Contato por email (ver bio)`
				case ContactEnum.COMMENTS:
					return `${emojis.contact.COMMENTS} Comenta "QUERO" que te ajudamos!`
				case ContactEnum.DM:
					return `${emojis.contact.DM} Chama no DM para mais info!`
				default:
					return ''
			}
		})

		return `
      ${emojis.title} ${ad.title}
      
      ${emojis.description} ${ad.description}
      
      ${emojis.price} Valor: ${formattedPrice}
      
      ${contactLines.join('\n')}
      
      ${emojis.hashtags} ${ad.hashtags.join(' ')}
        `.trim()
	}
}
