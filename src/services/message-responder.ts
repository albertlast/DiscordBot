import {
    Message
} from "discord.js"
import {
    PingFinder
} from "./ping-finder"
import {
    Command
} from "./command"
import {
    inject,
    injectable
} from "inversify"
import {
    TYPES
} from "../types"
@injectable()
export class MessageResponder {
    private pingFinder: PingFinder
    private command: Command

    constructor(@inject(TYPES.PingFinder) pingFinder: PingFinder, @inject(TYPES.Command) command: Command) {
        this.pingFinder = pingFinder
        this.command = command
    }

    handle(message: Message): Promise<Message> {
        if (this.pingFinder.isPing(message.content)) {
            return message.reply('pong!') as Promise<Message>
        }
        else if (this.command.isCommand(message.content)) {
            let success: boolean = false
            success = this.command.doThing(message.content)
            let successTxt: string = (success ? this.command.getMessage() : "nix")
            return message.reply(successTxt) as Promise<Message>
        }
        else
            return Promise.reject();
    }
}
