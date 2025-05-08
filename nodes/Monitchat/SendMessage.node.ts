import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

const input: NodeConnectionType = NodeConnectionType.Main

export class NasaPics implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Monitchat',
        name: 'monitchat',
        icon: 'file:monitchat.png',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Send messages to Monitchat',
        defaults: {
            name: 'Monitchat',
            color: '#00BFFF',
        },
        inputs: [input],
        outputs: [input],
        credentials: [
            {
                name: 'SendMessageApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api-v2.monitchat.com/api/v1',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'Send Message',
                        value: 'sendMessage',
                        description: 'Send a message to Monitchat',
                    },
                ],
                default: 'sendMessage',
                required: true,
                description: 'The operation to perform.',
            },
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                default: '',
                required: true,
                description: 'The token for authentication.',
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                default: '',
                required: true,
                description: 'The message to send.',
            },
            {
                displayName: 'Phone Number',
                name: 'phone_number',
                type: 'string',
                default: '',
                required: true,
                description: 'The phone number to send the message to.',
            },
            {
                displayName: 'Account Number',
                name: 'account_number',
                type: 'string',
                default: '',
                required: true,
                description: 'The account number associated with the message.',
            },
            {
                displayName: 'Open Ticket',
                name: 'open_ticket',
                type: 'boolean',
                default: false,
                required: true,
                description: 'Whether to open a ticket or not.',
            }
        ]
    };
}