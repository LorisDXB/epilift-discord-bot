export async function clearMessages(message, parsedCommand) {
    const error = argumentRobustness(parsedCommand);

    if (error) {
        message.reply("Those arguments are invalid.");
        return;
    }
    try {
        const clearSize = parsedCommand.arguments[0];
        const result = await message.channel.bulkDelete(clearSize);

        if (result) {
            const msg = await message.channel.send(`Deleted ${clearSize} messages successfully.`);
            msg.delete(50000);
        }
    } catch (error) {
        message.reply("Can't delete more than 100 messages are messages that are more than 2 weeks old.");
    }
}

function argumentRobustness(parsedCommand) {
    if (parsedCommand.arguments.length < 1) return true;
    if (isNaN(Number(parsedCommand.arguments[0]))) return true;
    return false;
}