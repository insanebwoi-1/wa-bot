const { forwardOrBroadCast, bot, parsedJid } = require('../lib/index')

bot(
	{
		pattern: 'forward ?(.*)',
		fromMe: true,
		desc: 'forward replied msg',
		type: 'misc',
	},
	async (message, match) => {
		if (!message.reply_message)
			return await message.sendMessage('*Reply to a message*')
		for (const jid of parsedJid(match)) await forwardOrBroadCast(jid, message)
	}
)

bot(
	{
		pattern: 'save ?(.*)',
		fromMe: true,
		desc: 'forward replied msg to u',
		type: 'misc',
	},
	async (message, match) => {
		if (!message.reply_message)
			return await message.sendMessage('*Reply to a message*')
		await forwardOrBroadCast(message.client.user.jid, message)
	}
)
