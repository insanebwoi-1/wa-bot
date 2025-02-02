const { y2mate, bot, getBuffer, genButtonMessage } = require('../lib/index')
const ytIdRegex =
	/(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

bot(
	{
		pattern: 'ytv ?(.*)',
		fromMe: true,
		desc: 'Download youtube video',
		type: 'download',
	},
	async (message, match) => {
		match = match || message.reply_message.text
		if (!match) return await message.sendMessage('_Example : ytv url_')
		if (match.startsWith('y2mate;')) {
			const [_, q, id] = match.split(';')
			const result = await y2mate.dl(id, 'video', q)
			await message.sendFromUrl(result)
		}
		if (!ytIdRegex.test(match))
			return await message.sendMessage('*Give me a yt link!*', {
				quoted: message.data,
			})
		const vid = ytIdRegex.exec(match)
		const { title, video } = await y2mate.get(vid[1])
		const buttons = []
		for (const q in video)
			buttons.push({ text: q, id: `ytv y2mate;${q};${vid[1]}` })
		if (!buttons.length)
			return await message.sendMessage('*Not found*', {
				quoted: message.quoted,
			})
		return await message.sendMessage(
			genButtonMessage(buttons, title, ''),
			{},
			'button'
		)
	}
)

bot(
	{
		pattern: 'yta ?(.*)',
		fromMe: true,
		desc: 'Download youtube audio',
		type: 'download',
	},
	async (message, match) => {
		match = match || message.reply_message.text
		if (!match) return await message.sendMessage('_Example : yta url_')
		if (!ytIdRegex.test(match))
			return await message.sendMessage('*Give me a yt link!*', {
				quoted: message.data,
			})
		const vid = ytIdRegex.exec(match)
		const audio = await y2mate.get(vid[1])
		const video = await yts((vid && vid[1]) || match)
		const { author, title, metadata } = video[0]
		const result = await y2mate.dl(vid[1], 'audio')
		const { buffer } = await getBuffer(result)
		if (!buffer)
			return await message.sendMessage(result, { quoted: message.data })
		return await message.sendMessage(
			await addAudioMetaData(
				buffer,
				title,
				author,
				'',
				metadata.thumbnails[0].url.split('?')[0]
			),
			{ quoted: message.data, mimetype: 'audio/mpeg' },
			'audio'
		)
	}
)
