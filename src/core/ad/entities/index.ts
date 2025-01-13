export interface IAd {
	id: string
	title: string
	hashtags: string[]
	description: string
	imagesUrls: string[]
	price: number
	userId: string
	createdAt: Date
	UpdatedAt: Date
}

export class Ad {
	id: string
	title: string
	hashtags: string[]
	description: string
	imagesUrls: string[]
	price: number
	userId: string
	createdAt?: Date
	UpdatedAt?: Date
	constructor(ad: IAd) {
		this.id = ad.id
		this.title = ad.title
		this.hashtags = ad.hashtags
		this.description = ad.description
		this.imagesUrls = ad.imagesUrls
		this.price = ad.price
		this.userId = ad.userId
		this.createdAt = new Date()
		this.UpdatedAt = new Date()
	}
}
