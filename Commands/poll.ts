import { MessageEmbed, Message, ColorResolvable } from "discord.js";

export async function poll(message: Message, args: string[], separator: string, embedColor: ColorResolvable) {

    const findSep = args.find(char => char.includes(separator));

    if (findSep === undefined) {

        const question = args.join(' ');
        if (!question) {
            return message.channel.send('Please enter a question');
        }

        message.delete();

        const embed = new MessageEmbed().setTitle('📊 ' + question).setColor(embedColor);

        await message.channel.send({ embeds: [embed] }).then(msg => {
            msg.react('👍');
            msg.react('👎');
        });
    }

    else {

        message.delete();

        const embed = new MessageEmbed();
        const options = [];
        let j = 0;
        for (let i = 0; i < args.length; i++) {
            if (args[i] === separator) {
                args.splice(i, 1);
                const question = args.splice(0, i);
                embed.setTitle('📊 ' + question.join(' '))
                break;
            }
        }

        for (let i = 0; i < args.length; i++) {
            if (args[i] === separator) {
                args.splice(i, 1);
                options[j] = args.splice(0, i);
                j++;
                i = 0;
            }
        }

        const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
            '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

        const arr: string[] = [];
        options[j] = args;

        if (options.length > alphabet.length) {
            return await message.channel.send('Please don\'t input more than 26 options.').then(sent => {
                setTimeout(() => {
                    sent.delete();
                }, 2000);
            });
        }

        let count = 0;

        options.forEach(option => {
            arr.push(alphabet[count] + ' ' + option.join(' '));
            count++;
        });

        embed
            .setDescription(arr.join('\n\n'))
            .setColor(embedColor);

        await message.channel.send({ embeds: [embed] }).then(msg => {
            for (let i = 0; i < options.length; i++) {
                msg.react(alphabet[i]);
            }
        });
    }
}