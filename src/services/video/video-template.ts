export const videoTemplate = (imageUrl: string, audioUrl: string, title: string, price: string) => {
    return (
        {
			timeline: {
				background: '#F1EFEC',
				soundtrack: {
					src: audioUrl,
					effect: 'fadeOut'
				},
				tracks: [
					{
						clips: [
							{
								asset: {
									type: 'text',
									text: `COMPRE AGORA`,
									alignment: {
										horizontal: 'center',
										vertical: 'center'
									},
									font: {
										color: '#123458',
										family: 'Montserrat ExtraBold',
										size: 66,
										lineHeight: 1
									},
									width: 600,
									height: 180,
									background: {
										color: '#D4C9BE',
										borderRadius: 50
									}
								},
								start: 1.955,
								length: 30,
								offset: {
									x: 0,
									y: -0.3
								},
								position: 'center',
								transition: {
									in: 'slideUp'
								}
							}
						]
					},
					{
						clips: [
							{
								length: 28,
								asset: {
									type: 'image',
									src: imageUrl
								},
								start: 1.03,
								offset: {
									x: 0,
									y: 0
								},
								scale: 0.4,
								position: 'center',
								transition: {
									in: 'slideUp'
								}
							}
						]
					},
					{
						clips: [
							{
								asset: {
									type: 'text',
									text: title,
									alignment: {
										horizontal: 'center',
										vertical: 'center'
									},
									font: {
										color: '#123458',
										family: 'Montserrat ExtraBold',
										size: '48',
										lineHeight: 1
									},
									width: 800,
									height: 422,
									stroke: {
										color: '#030303',
										width: 0
									}
								},
								start: 0,
								length: 30,
								offset: {
									x: 0,
									y: 0.338
								},
								position: 'center',
								fit: 'none',
								scale: 1,
								transition: {
									in: 'slideUpFast'
								}
							}
						]
					},
					{
						clips: [
							{
								fit: 'none',
								scale: 1,
								asset: {
									type: 'text',
									text: price,
									alignment: {
										horizontal: 'center',
										vertical: 'center'
									},
									font: {
										color: '#030303',
										family: 'Montserrat ExtraBold',
										size: 64,
										lineHeight: 1
									},
									width: 728,
									height: 72
								},
								start: 0.25,
								length: 30,
								offset: {
									x: 0,
									y: -0.4
								},
								position: 'center',
								transition: {
									in: 'slideUpFast'
								}
							}
						]
					},
					{
						clips: [
							{
								length: 30,
								asset: {
									type: 'image',
									src: 'https://templates.shotstack.io/grey-minimalist-product-ad/cfd0e601-9e06-47b7-9d3d-c79e2ae51711/source.png'
								},
								start: 0,
								offset: {
									x: 0,
									y: -0.471
								},
								scale: 0.741,
								position: 'center'
							}
						]
					}
				]
			},
			output: {
				format: 'mp4',
				size: {
					width: 1080,
					height: 1920
				}
			}
		}
    )
}
