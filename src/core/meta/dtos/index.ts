export enum ContactEnum {
    BIO = 'BIO',
    EMAIL = 'EMAIL',
    COMMENTS = 'COMMENTS',
    DM = 'DM',
}

export class ShareAdDTO {
	adId: string
    accessToken: string
	accountId: string
	contacts: ContactEnum[]
}