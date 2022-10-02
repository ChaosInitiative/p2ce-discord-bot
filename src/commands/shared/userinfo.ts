import { CommandInteraction, EmbedBuilder, PartialUser, User } from 'discord.js';
import { LogLevelColor } from '../../utils/log';

export async function getUserInfo(interaction: CommandInteraction, user: User | PartialUser, ephemeral: boolean) {
	const embed = new EmbedBuilder()
		.setColor(LogLevelColor.INFO)
		.setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: user.avatarURL({ size: 1024 }) ?? undefined })
		.setThumbnail(user.displayAvatarURL({ size: 1024 }))
		.addFields(
			{ name: 'User ID', value: `\`${user.id}\`` },
			{ name: 'Joined Discord', value: `<t:${(user.createdAt.getTime() / 1000).toFixed(0)}:D>` })
		.setTimestamp();
	return interaction.reply({ embeds: [embed], ephemeral: ephemeral });
}
