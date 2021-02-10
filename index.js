//here is the chalk library to add colors to our console.
const chalk = require('chalk');

//here we are including the discord.js.
const discord = require('discord.js');
const client = new discord.Client();
const botToken = 'YOUR-BOT-TOKEN';

//here we are specifying our bot's prefix.
const prefix = '--';

//here we are storing the datas about the channels.
const botChannelName = 'BOT-CHANNEL-NAME';
const panelChannelId = 'CHANNEL-ID';

//here we are storing our report datas.
var storedImage = "";
var storedTitle = "";

//returns full date in time.
function getDate() {
    return new Date(Date.now()).toString();
}

//returns hour:minute:second.
function getTime() {
    return new Date().toTimeString().split(' ')[0].toString();
}

//sends message to specified channel name.
function SendReport(targetMessage) {
    client.channels.cache.find(targetChannel => targetChannel.name === botChannelName).send(targetMessage);
}

//prepares the bot itself.
function PrepareBot(client)
{
    client.on('ready', () => {
        console.log(chalk.magenta(`[${getTime()}] I'm ready to use!`));
    });
    client.login(botToken);
}

//call of the PrepareBot function.
PrepareBot(client);

//on client message event.
client.on('message', async message => {
    if(!message.content.startsWith(`${prefix}`) || message.channel.id != panelChannelId)
        return;
    else if(message.content.includes(`${prefix}set-image`))
    {
        const image = message.content.slice(prefix.length + 9).trim().split(/ +/g);
        const convertedImage = image.join(' ');

        //here is the check for the message is link or not via regex.
        if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(convertedImage)) 
        {
            storedImage = convertedImage.toString();
            console.log(chalk.cyan(`[${getTime()}] [INFO] Image set to: ` + convertedImage.toString()));
            message.channel.send(`Image set successful.`);
        }
        else
        {
            console.log(chalk.red(`[${getTime()}] [ERROR] bad attempt to set image!`))
            message.channel.send(`You need to enter a proper link!`);
        }
    }
    else if(message.content.includes(`${prefix}set-title`))
    {
        const title = message.content.slice(prefix.length + 9).trim().split(/ +/g);
        const convertedTitle = title.join(' ');

        if(convertedTitle.length > 0)
        {
            storedTitle = convertedTitle;
            console.log(chalk.cyan(`[${getTime()}] [INFO] Title link set to: ` + convertedTitle.toString()));
            message.channel.send(`Title set successful.`);
        }
        else
        {
            console.log(chalk.red(`[${getTime()}] [ERROR] bad attempt to set title!`));
            message.channel.send(`You need to enter a proper title!`);
        }
    }
    else if(message.content === `${prefix}report`)
    {
        if(storedTitle.length > 0 && storedImage.length > 0)
        {
            SendReport(new discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(storedTitle.toString())
                .setImage(storedImage.toString())
                .setTimestamp())
            
            console.log(chalk.green(`[${getTime()}] [INFO] Report sent successfully!`))

            storedImage = "";
            storedTitle = "";
            console.log(chalk.cyan(`[${getTime()}] [INFO] storedImage and storedTitle cleared successfully.`));
            message.channel.send(`Report sent successful.`);
        }
        else
        {
            console.log(chalk.red(`[${getTime()}] [ERROR] bad attempt to report!`));
            message.channel.send(`You need to set the title and image for the next post.`);
        }
    }
    else if(message.content === `${prefix}report-default`)
    {
        if(storedTitle.length > 0)
        {
            SendReport(new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(storedTitle.toString())
            .setImage('HERE-IS-YOUR-DEFAULT-IMAGE')
            .setTimestamp())

            console.log(chalk.green(`[${getTime()}] [INFO] Report sent successfully!`))

            storedImage = "";
            storedTitle = "";
            console.log(chalk.cyan(`[${getTime()}] [INFO] storedImage and storedTitle cleared successfully.`));
            message.channel.send(`Report sent successful.`);
        }
        else
        {
            console.log(chalk.red(`[${getTime()}] [ERROR] bad attempt to report-default!`));
            message.channel.send(`You need to set the title for this report!`);
        }
    }
    else if(message.content === `${prefix}help`)
    {
        message.channel.send(new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Commands\n')
            .setDescription(`
            ${prefix}status    -->    Gives bot's status.\n
            ${prefix}date   -->   Gives detailed date and time with this command.\n
            ${prefix}time   -->   Gives current clock.\n
            ${prefix}set-title <title>   -->   Sets title for next post.\n
            ${prefix}set-image <url>   -->   Sets image for next post.\n
            ${prefix}report   -->   Posts new report with image.\n
            ${prefix}report-default   -->   Posts new report without an image.\n`))
    }
    else if(message.content === `${prefix}`)
        message.channel.send(`You need to enter commands with prefix!`);
    else if(message.content === `${prefix}status`)
        message.channel.send(`I'm waiting your commands right now.`);
    else if(message.content === `${prefix}date`)
        message.channel.send(`It is ${getDate()}.`);
    else if(message.content === `${prefix}time`)
        message.channel.send(`It is ${getTime()} o'clock.`);
    else
    {
        console.log(chalk.red(`[${getTime()}] [ERROR] bad attempt to use commands!`));
        message.channel.send("Bad command. Get info via --help.");
    }
});
