import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class NasaPics implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Monitchat',
        name: 'monitchat',
        icon: 'file:monitchat.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Send messages to Monitchat',
        defaults: {
            name: 'Monitchat',
        },
        inputs: ['main'],
        outputs: ['main'],
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
																noDataExpression: true,
                options: [
                    {
                        name: 'Send Message',
                        value: 'sendMessage',
                        description: 'Send a message to Monitchat',
																								action: 'Send a message to monitchat',
                    },
                ],
                default: 'sendMessage',
                required: true,
            },
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
																typeOptions: { password: true },
                default: '',
                required: true,
                description: 'The token for authentication',
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                default: '',
                required: true,
                description: 'The message to send',
            },
            {
                displayName: 'Phone Number',
                name: 'phone_number',
                type: 'string',
                default: '',
                required: true,
                description: 'The phone number to send the message to',
            },
            {
                displayName: 'Account Number',
                name: 'account_number',
                type: 'string',
                default: '',
                required: true,
                description: 'The account number associated with the message',
            },
            {
                displayName: 'Open Ticket',
                name: 'open_ticket',
                type: 'boolean',
                default: false,
                required: true,
                description: 'Whether to open a ticket or not',
            }
        ]
    };
}