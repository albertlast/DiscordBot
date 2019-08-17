import "reflect-metadata"
import 'mocha'
import {
    expect
} from 'chai'
import {
    PingFinder
} from "../services/ping-finder"
import {
    Command
} from "../services/command"
import {
    MessageResponder
} from "../services/message-responder"
import {
    instance,
    mock,
    verify,
    when
} from "ts-mockito"
import {
    Message
} from "discord.js"
describe('MessageResponder', () => {
    let mockedPingFinderClass: PingFinder
    let mockedPingFinderInstance: PingFinder
    let mockedCommandClass: Command
    let mockedCommandInstance: Command
    let mockedMessageClass: Message
    let mockedMessageInstance: Message
    let service: MessageResponder
    beforeEach(() => {
        mockedPingFinderClass = mock(PingFinder)
        mockedPingFinderInstance = instance(mockedPingFinderClass)
        mockedCommandClass = mock(Command)
        mockedCommandInstance = instance(mockedCommandClass)
        mockedMessageClass = mock(Message)
        mockedMessageInstance = instance(mockedMessageClass)
        setMessageContents()
        service = new MessageResponder(mockedPingFinderInstance, mockedCommandInstance)
    })
    it('(ping) should reply', async () => {
        whenIsPingThenReturn(true)
        await service.handle(mockedMessageInstance)
        verify(mockedMessageClass.reply('pong!')).once()
    })
    it('(ping) should not reply', async () => {
        whenIsPingThenReturn(false);
        await service.handle(mockedMessageInstance)
            .then(() => {
                // Successful promise is unexpected, so we fail the test 
                expect.fail('Unexpected promise');
            })
            .catch(() => {
                // Rejected promise is expected, so nothing happens here 
            });
        verify(mockedMessageClass.reply('pong!')).never();
    })
    it('(command) should reply', async () => {
        whenIsCommandThenReturn(true)
        await service.handle(mockedMessageInstance)
        verify(mockedMessageClass.reply('nice!')).once()
    })
    it('(command) should not reply', async () => {
        whenIsCommandThenReturn(false);
        await service.handle(mockedMessageInstance)
            .then(() => {
                // Successful promise is unexpected, so we fail the test 
                expect.fail('Unexpected promise');
            })
            .catch(() => {
                // Rejected promise is expected, so nothing happens here 
            });
        verify(mockedMessageClass.reply('nice!')).never();
    })
    function setMessageContents() {
        mockedMessageInstance.content = "Non-empty string";
    }
    function whenIsPingThenReturn(result: boolean) {
        when(mockedPingFinderClass.isPing("Non-empty string")).thenReturn(result);
    }
    function whenIsCommandThenReturn(result: boolean) {
        when(mockedCommandClass.isCommand("Non-empty string")).thenReturn(result);
        when(mockedCommandClass.doThing("Non-empty string")).thenReturn(result);
        when(mockedCommandClass.getMessage()).thenReturn("nice!");
    }
})

describe('PingFinder', () => {
    let service: PingFinder;
    beforeEach(() => {
        service = new PingFinder();
    })
    it('should find "ping" in the string', () => {
        expect(service.isPing("ping")).to.be.true
    })
})

describe('Command', () => {
    let service: Command;
    beforeEach(() => {
        service = new Command();
    })
    it('prefix should be not empty', () => {
        expect(Command.getPrefix().length > 0).to.be.true
    })
    let prefix: string = Command.getPrefix()
    it('should find "' + prefix + '" in the string', () => {
        expect(service.isCommand(prefix)).to.be.true
    })
    it('should find " ' + prefix + ' in the string', () => {
        expect(service.isCommand(" " + prefix)).to.be.true
    })
    it('should find "' + prefix.toUpperCase() + '" in the string', () => {
        expect(service.isCommand(prefix.toUpperCase())).to.be.true
    })
    it('should not find "asd ' + prefix + ' in the string', () => {
        expect(service.isCommand("asd " + prefix)).to.be.false
    })
    it('should find "' + prefix + ' do something" in the string', () => {
        expect(service.isCommand(prefix + " do something")).to.be.true
    })
}) 
