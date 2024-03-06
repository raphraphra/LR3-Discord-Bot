import { Client, Message, MessageReaction, Typing } from 'discord.js';
import CONFIG from './config.json' with { type: "json"};

const TYPING_THRESHOLD = 1000;
const TYPING_OFFSET = 1;
const TYPING_EVENT_TRIGGER_TIME = 8;

const client = new Client( { intents: ["Guilds", "GuildMessages", "GuildMessageTyping", "MessageContent"] } );

let typingUsers = {}

client.login(CONFIG.token)

function onTyping(typing) {
    const text = `${typing.member.displayName} is typing at ${typing.startedAt.toTimeString()}`;
    const typeStart = typingUsers[typing.user.id];

    console.log((typing.startedAt - typeStart)/1000)

    const duration = (typing.startedAt - typeStart)/1000 
    if (duration % TYPING_EVENT_TRIGGER_TIME === 0 && duration < TYPING_THRESHOLD) {
        return;   
    }
    
    typingUsers[typing.user.id] = typing.startedAt

    console.log(text);
}

function typingEnd(message) {
    const author = message.author;
    const start = typingUsers[author.id];
    const end = message.createdAt;
    const duration = (end-start)/1000;

    const userName = author.displayName;
    message.reply(`It took you around ${duration + TYPING_OFFSET} seconds to write this !`);

}


client.on('typingStart', onTyping)
client.on("messageCreate", typingEnd)