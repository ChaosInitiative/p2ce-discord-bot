import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/interaction';
import { PermissionLevel } from '../../utils/permissions';
import { escapeSpecialCharacters } from '../../utils/utils';
import { createCanvas, loadImage } from 'canvas';
import canvasGif from 'canvas-gif';
import { uwuify } from 'owoify-js';

const regular      = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const square       = ['\\🅰','\\🅱','🅲','🅳','🅴','🅵','🅶','🅷','🅸','🅹','🅺','🅻','🅼','🅽','\\🅾','\\🅿','🆀','🆁','🆂','🆃','🆄','🆅','🆆','🆇','🆈','🆉','\\🅰','\\🅱','🅲','🅳','🅴','🅵','🅶','🅷','🅸','🅹','🅺','🅻','🅼','🅽','\\🅾','\\🅿','🆀','🆁','🆂','🆃','🆄','🆅','🆆','🆇','🆈','🆉'];
const bubble       = ['ⓐ','ⓑ','ⓒ','ⓓ','ⓔ','ⓕ','ⓖ','ⓗ','ⓘ','ⓙ','ⓚ','ⓛ','ⓜ','ⓝ','ⓞ','ⓟ','ⓠ','ⓡ','ⓢ','ⓣ','ⓤ','ⓥ','ⓦ','ⓧ','ⓨ','ⓩ','Ⓐ','Ⓑ','Ⓒ','Ⓓ','Ⓔ','Ⓕ','Ⓖ','Ⓗ','Ⓘ','Ⓙ','Ⓚ','Ⓛ','Ⓜ','Ⓝ','Ⓞ','Ⓟ','Ⓠ','Ⓡ','Ⓢ','Ⓣ','Ⓤ','Ⓥ','Ⓦ','Ⓧ','Ⓨ','Ⓩ'];
const bubbleFilled = ['🅐','🅑','🅒','🅓','🅔','🅕','🅖','🅗','🅘','🅙','🅚','🅛','🅜','🅝','🅞','🅟','🅠','🅡','🅢','🅣','🅤','🅥','🅦','🅧','🅨','🅩','🅐','🅑','🅒','🅓','🅔','🅕','🅖','🅗','🅘','🅙','🅚','🅛','🅜','🅝','🅞','🅟','🅠','🅡','🅢','🅣','🅤','🅥','🅦','🅧','🅨','🅩'];
const wide         = ['ａ','ｂ','ｃ','ｄ','ｅ','ｆ','ｇ','ｈ','ｉ','ｊ','ｋ','ｌ','ｍ','ｎ','ｏ','ｐ','ｑ','ｒ','ｓ','ｔ','ｕ','ｖ','ｗ','ｘ','ｙ','ｚ','Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ','Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ'];
const cursive      = ['𝒶','𝒷','𝒸','𝒹','𝑒','𝒻','𝑔','𝒽','𝒾','𝒿','𝓀','𝓁','𝓂','𝓃','𝑜','𝓅','𝓆','𝓇','𝓈','𝓉','𝓊','𝓋','𝓌','𝓍','𝓎','𝓏','𝒜','𝐵','𝒞','𝒟','𝐸','𝐹','𝒢','𝐻','𝐼','𝒥','𝒦','𝐿','𝑀','𝒩','𝒪','𝒫','𝒬','𝑅','𝒮','𝒯','𝒰','𝒱','𝒲','𝒳','𝒴','𝒵'];
const medievalR    = ['𝔞','𝔟','𝔠','𝔡','𝔢','𝔣','𝔤','𝔥','𝔦','𝔧','𝔨','𝔩','𝔪','𝔫','𝔬','𝔭','𝔮','𝔯','𝔰','𝔱','𝔲','𝔳','𝔴','𝔵','𝔶','𝔷','𝔄','𝔅','ℭ','𝔇','𝔈','𝔉','𝔊','ℌ','ℑ','𝔍','𝔎','𝔏','𝔐','𝔑','𝔒','𝔓','𝔔','ℜ','𝔖','𝔗','𝔘','𝔙','𝔚','𝔛','𝔜','ℨ'];
const medievalB    = ['𝖆','𝖇','𝖈','𝖉','𝖊','𝖋','𝖌','𝖍','𝖎','𝖏','𝖐','𝖑','𝖒','𝖓','𝖔','𝖕','𝖖','𝖗','𝖘','𝖙','𝖚','𝖛','𝖜','𝖝','𝖞','𝖟','𝕬','𝕭','𝕮','𝕯','𝕰','𝕱','𝕲','𝕳','𝕴','𝕵','𝕶','𝕷','𝕸','𝕹','𝕺','𝕻','𝕼','𝕽','𝕾','𝕿','𝖀','𝖁','𝖂','𝖃','𝖄','𝖅'];
const monospace    = ['𝚊','𝚋','𝚌','𝚍','𝚎','𝚏','𝚐','𝚑','𝚒','𝚓','𝚔','𝚕','𝚖','𝚗','𝚘','𝚙','𝚚','𝚛','𝚜','𝚝','𝚞','𝚟','𝚠','𝚡','𝚢','𝚣','𝙰','𝙱','𝙲','𝙳','𝙴','𝙵','𝙶','𝙷','𝙸','𝙹','𝙺','𝙻','𝙼','𝙽','𝙾','𝙿','𝚀','𝚁','𝚂','𝚃','𝚄','𝚅','𝚆','𝚇','𝚈','𝚉'];
const smallCaps    = ['ᴀ','ʙ','ᴄ','ᴅ','ᴇ','ғ','ɢ','ʜ','ɪ','ᴊ','ᴋ','ʟ','ᴍ','ɴ','ᴏ','ᴘ','ǫ','ʀ','s','ᴛ','ᴜ','ᴠ','ᴡ','x','ʏ','ᴢ','ᴀ','ʙ','ᴄ','ᴅ','ᴇ','ғ','ɢ','ʜ','ɪ','ᴊ','ᴋ','ʟ','ᴍ','ɴ','ᴏ','ᴘ','ǫ','ʀ','s','ᴛ','ᴜ','ᴠ','ᴡ','x','ʏ','ᴢ'];
const tiny         = ['ᵃ','ᵇ','ᶜ','ᵈ','ᵉ','ᶠ','ᵍ','ʰ','ᶤ','ʲ','ᵏ','ˡ','ᵐ','ᶰ','ᵒ','ᵖ','ᵠ','ʳ','ˢ','ᵗ','ᵘ','ᵛ','ʷ','ˣ','ʸ','ᶻ','ᴬ','ᴮ','ᶜ','ᴰ','ᴱ','ᶠ','ᴳ','ᴴ','ᴵ','ᴶ','ᴷ','ᴸ','ᴹ','ᴺ','ᴼ','ᴾ','ᵠ','ᴿ','ˢ','ᵀ','ᵁ','ᵛ','ᵂ','ᵡ','ᵞ','ᶻ'];

function replaceText(text: string, from: string[], to: string[]) {
	for (let i = 0; i < 26 * 2; i++) {
		text = text.replaceAll(from[i], to[i]);
	}
	return text;
}

const Fun: Command = {
	permissionLevel: PermissionLevel.EVERYONE,
	canBeExecutedWithoutPriorGuildSetup: true,

	data: new SlashCommandBuilder()
		.setName('fun')
		.setDescription('Fun text commands.')
		.addSubcommandGroup(group => group
			.setName('text')
			.setDescription('Fun commands that print funny text.')
			.addSubcommand(subcommand => subcommand
				.setName('square')
				.setDescription('Squareify the input text.')
				.addStringOption(option => option
					.setName('text')
					.setDescription('Text to make square')
					.setRequired(true)))
			.addSubcommand(subcommand => subcommand
				.setName('bubble')
				.setDescription('Bubbleify the input text.')
				.addStringOption(option => option
					.setName('text')
					.setDescription('Text to make bubbly')
					.setRequired(true))
				.addBooleanOption(option => option
					.setName('invert')
					.setDescription('Invert bubble filling')))
			.addSubcommand(subcommand => subcommand
				.setName('wide')
				.setDescription('Widen the input text.')
				.addStringOption(option => option
					.setName('text')
					.setDescription('Text to widen')
					.setRequired(true)))
			.addSubcommand(subcommand => subcommand
				.setName('cursive')
				.setDescription('Cursiveify the input text.')
				.addStringOption(option => option
					.setName('text')
					.setDescription('Text to make cursive')
					.setRequired(true)))
			.addSubcommand(subcommand => subcommand
				.setName('medieval')
				.setDescription('Medievalify the input text.')
				.addStringOption(option => option
					.setName('text')
					.setDescription('Text to make medieval')
					.setRequired(true))
				.addBooleanOption(option => option
					.setName('bold')
					.setDescription('Use bold medieval font')))
			.addSubcommand(subcommand => subcommand
				.setName('monospace')
				.setDescription('Monospaceify the input text.')
				.addStringOption(option => option
					.setName('text')
					.setDescription('Text to make monospace')
					.setRequired(true)))
			.addSubcommand(subcommand => subcommand
				.setName('smallcaps')
				.setDescription('Smallcapsify the input text.')
				.addStringOption(option => option
					.setName('text')
					.setDescription('Text to make smallcaps')
					.setRequired(true)))
			.addSubcommand(subcommand => subcommand
				.setName('tiny')
				.setDescription('Minify the input text.')
				.addStringOption(option => option
					.setName('text')
					.setDescription('Text to make tiny')
					.setRequired(true)))
			.addSubcommand(subcommand => subcommand
				.setName('uwuify')
				.setDescription('UwUify the input text.')
				.addStringOption(option => option
					.setName('text')
					.setDescription('Text to UwUify')
					.setRequired(true))))
		.addSubcommandGroup(group => group
			.setName('image')
			.setDescription('Fun commands to modify images.')
			.addSubcommand(subcommand => subcommand
				.setName('speechbubble')
				.setDescription('Add a transparent speech bubble to the given image.')
				.addAttachmentOption(option => option
					.setName('image')
					.setDescription('The image to add a speech bubble to')
					.setRequired(true))
				.addNumberOption(option => option
					.setName('x')
					.setDescription('The X position of the tip of the speech bubble, from 0-1 (with (0,0) as the top left of the image)')
					.setMinValue(0)
					.setMaxValue(1))
				.addNumberOption(option => option
					.setName('y')
					.setDescription('The Y position of the tip of the speech bubble, from 0-1 (with (0,0) as the top left of the image)')
					.setMinValue(0)
					.setMaxValue(1))
				.addIntegerOption(option => option
					.setName('fps')
					.setDescription('Controls the FPS when uploading GIFs')
					.setMinValue(1)
					.setMaxValue(60)))),

	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		switch (interaction.options.getSubcommandGroup()) {
		case 'text': {
			const text = interaction.options.getString('text', true);

			switch (interaction.options.getSubcommand()) {
			case 'square': {
				return interaction.reply(replaceText(text, regular, square));
			}

			case 'bubble': {
				if (interaction.options.getBoolean('invert')) {
					return interaction.reply(replaceText(text, regular, bubbleFilled));
				} else {
					return interaction.reply(replaceText(text, regular, bubble));
				}
			}

			case 'wide': {
				return interaction.reply(replaceText(text, regular, wide));
			}
		
			case 'cursive': {
				return interaction.reply(replaceText(text, regular, cursive));
			}
		
			case 'medieval': {
				if (interaction.options.getBoolean('bold')) {
					return interaction.reply(replaceText(text, regular, medievalB));
				} else {
					return interaction.reply(replaceText(text, regular, medievalR));
				}
			}
		
			case 'monospace': {
				return interaction.reply(replaceText(text, regular, monospace));
			}
		
			case 'smallcaps': {
				return interaction.reply(replaceText(text, regular, smallCaps));
			}
		
			case 'tiny': {
				return interaction.reply(replaceText(text, regular, tiny));
			}
		
			case 'uwuify': {
				return interaction.reply(escapeSpecialCharacters(uwuify(text)));
			}
			}
			break;
		}
		case 'image': {
			switch (interaction.options.getSubcommand()) {
			case 'speechbubble': {
				const image = interaction.options.getAttachment('image', true);
				if (!image.contentType || !image.contentType.startsWith('image')) {
					return interaction.reply({ content: 'File attached does not appear to be an image!', ephemeral: true });
				}

				const gif = image.contentType.endsWith('gif');
				const fps = interaction.options.getInteger('fps') ?? 24;

				const imageResponse = await fetch(image.url);
				if (!imageResponse.body) {
					return interaction.reply({ content: 'Unable to download attachment.', ephemeral: true });
				}

				await interaction.deferReply();

				let imageName = 'image';
				if (image.name) {
					imageName = image.name.slice(0, image.name.lastIndexOf('.'));
				}

				const imageBuf = Buffer.from(await imageResponse.arrayBuffer());
				const drawableImage = await loadImage(imageBuf);
				const canvas = createCanvas(drawableImage.width, drawableImage.height);

				const tipX = interaction.options.getNumber('x');
				const tipY = interaction.options.getNumber('y');

				// Needs to be any to work with canvas-gif
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const drawSpeechBubble = (ctx: any, width: number, height: number, fillColor?: string) => {
					ctx.beginPath();
					const semiMajor = width / 1.9;
					const semiMajorSquared = Math.pow(semiMajor, 2);
					const semiMinor = height / 6;
					const semiMinorSquared = Math.pow(semiMinor, 2);
					ctx.ellipse(width / 2, 0, semiMajor, semiMinor, 0, 0, 2 * Math.PI);
					ctx.moveTo(width / 2, semiMinor);
					ctx.lineTo(tipX ? tipX * width : semiMajor, tipY ? tipY * height : height / 3);
					// i'm a genius
					const endPointX = width / 2.5;
					const endPointY = Math.sqrt(semiMinorSquared - ((Math.pow(endPointX, 2) * semiMinorSquared) / semiMajorSquared));
					ctx.lineTo(endPointX, endPointY);
					ctx.clip();
					if (fillColor) {
						ctx.fillStyle = fillColor;
						ctx.fillRect(0, 0, width, height);
					} else {
						ctx.clearRect(0, 0, width, height);
					}
				};

				let attachment: AttachmentBuilder;
				if (!gif) {
					const context = canvas.getContext('2d');
					context.drawImage(drawableImage, 0, 0);
					drawSpeechBubble(context, canvas.width, canvas.height);

					attachment = new AttachmentBuilder(canvas.createPNGStream())
						.setName(`${imageName}_speech_bubble.png`);
				} else {
					const outputBuf = await canvasGif(
						imageBuf,
						(context, width, height/*, totalFrames, currentFrame*/) => {
							drawSpeechBubble(context, width, height, '#313338');
						},
						{
							optimiser: true,
							fps: fps,
						}
					);
					attachment = new AttachmentBuilder(outputBuf)
						.setName(`${imageName}_speech_bubble.gif`);
				}
				return interaction.editReply({ files: [attachment] });
			}
			}
			break;
		}
		}
	}
};
export default Fun;
