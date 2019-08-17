import {
    injectable
} from "inversify"
@injectable()
export class Command {
    private static prefix = '!bot'
    public isCommand(stringToSearch: string): boolean {
        let cleanString = stringToSearch
        cleanString = stringToSearch.toLowerCase()
        cleanString = cleanString.trimLeft()
        return cleanString.startsWith(Command.prefix)
    }

    public static getPrefix(): string {
        return this.prefix
    }
    public doThing(message: string): boolean {
        return true
    }

    public getMessage(): string {
        return "nice!"
    }
}
