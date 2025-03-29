const ERROR_API_SCHEMA = {
	properties: {
		statusCode: {
			type: 'number'
		},
		message: {
			type: 'string'
		},
		error: {
			type: 'string'
		}
	}
}

export const BAD_REQUEST_API_RESPONSE = {
	status: 400,
	description: 'Má requisição',
	schema: ERROR_API_SCHEMA
}

export const UNAUTHORIZED_API_RESPONSE = {
	status: 401,
	description: 'Não autorizado',
	schema: ERROR_API_SCHEMA
}

export const INTERNAL_SERVER_ERROR_API_RESPONSE = {
	status: 500,
	description: 'Erro interno do servidor',
	schema: ERROR_API_SCHEMA
}

export const FORBIDDEN_API_RESPONSE = {
	status: 403,
	description: 'Requisição proibida',
	schema: ERROR_API_SCHEMA
}

export const NOT_FOUND_API_RESPONSE = {
	status: 404,
	description: 'Não encontrado',
	schema: ERROR_API_SCHEMA
}

export const EMPTY_SCHEMA_API_RESPONSE = {
	properties: {}
}

export const OK_API_RESPONSE = {
	status: 200,
	description: 'Ok',
	schema: EMPTY_SCHEMA_API_RESPONSE
}

export const EMAIL_PARAM = {
	name: 'email',
	required: true,
	description: 'Email do usuário',
	type: 'string'
}

export const CREATE_USER_API_RESPONSE = {
	status: 201,
	description: 'Usuario criado com sucesso',
	schema: EMPTY_SCHEMA_API_RESPONSE
}

export const UPDATE_USER_API_RESPONSE = {
	status: 200,
	description: 'Usuario atualizado com sucesso',
	schema: EMPTY_SCHEMA_API_RESPONSE
}

export const DELETE_USER_API_RESPONSE = {
	status: 200,
	description: 'Usuario deletado com sucesso',
	schema: EMPTY_SCHEMA_API_RESPONSE
}

export const USER_ID_PARAM = {
	name: 'id',
	required: true,
	description: 'Id do usuário',
	type: 'string'
}

export const MONTHLY_BONUS_API_RESPONSE = {
	status: 200,
	description: 'Execute the cron job to add the monthly bonus'
}

export const GET_USER_API_RESPONSE = {
	status: 200,
	description: 'Ok',
	schema: {
		properties: {
			id: {
				type: 'string'
			},
			email: {
				type: 'string'
			},
			credits: {
				type: 'number'
			},
			tier: {
				type: 'string'
			},
			createdAt: {
				type: 'string',
				format: 'date-time'
			},
			updatedAt: {
				type: 'string',
				format: 'date-time'
			}
		}
	}
}



export const CREATE_AD_API_RESPONSE = {
	status: 201,
	description: 'Anúncio criado com sucesso',
	schema: {
		type: 'object',
		properties: {
		  id: { type: 'string' },
		  title: { type: 'string' },
		  description: { type: 'string' },
		  price: { type: 'integer' },
		  hashtags: { type: 'array', items: { type: 'string' } },
		  imageUrl: { type: 'string' },
		  videoId: { type: 'string' },
		  audioUrl: { type: 'string' },
		  caption: { type: 'string' },
		  userId: { type: 'string' },
		},
	}
}

export const SHARE_AD_API_RESPONSE = {
	status: 201,
	description: 'Anúncio compartilhado com sucesso',
	schema: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			title: { type: 'string' },
			description: { type: 'string' },
			price: { type: 'integer' },
			hashtags: { type: 'array', items: { type: 'string' } },
			imageUrl: { type: 'string' },
			videoId: { type: 'string' },
			audioUrl: { type: 'string' },
			caption: { type: 'string' },
			userId: { type: 'string' },
		},
	}
}

export const FIND_AD_API_RESPONSE = {
	status: 200,
	description: 'Anúncio encontrado com sucesso',
	schema: {
		type: 'object',
		properties: {
			id: { type: 'string' },
			title: { type: 'string' },
			description: { type: 'string' },
			price: { type: 'integer' },
			hashtags: { type: 'array', items: { type: 'string' } },
			imageUrl: { type: 'string' },
			videoId: { type: 'string' },
			audioUrl: { type: 'string' },
			caption: { type: 'string' },
			userId: { type: 'string' },
		},
	}
}

export const GET_USER_AD_API_RESPONSE = {
	status: 200,
	description: 'Anúncios encontrados com sucesso',
	schema: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				title: { type: 'string' },
				description: { type: 'string' },
				price: { type: 'integer' },
				hashtags: { type: 'array', items: { type: 'string' } },
				imageUrl: { type: 'string' },
				videoId: { type: 'string' },
				audioUrl: { type: 'string' },
				caption: { type: 'string' },
				userId: { type: 'string' },
			},
		},
	}
}

export const DELETE_AD_API_RESPONSE = {
	status: 204,
	description: 'Anúncio deletado com sucesso.',
}
