import { INodeProperties } from "n8n-workflow";

const displayOptions = {
    displayOptions: {
        show: {
            operation: ['sendMessage'],
        }
    }
}

export const sendMessageProperties: INodeProperties[] = [
    {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        required: true,
        description: 'The message to send',
        ...displayOptions
    },
    {
        displayName: 'Phone Number',
        name: 'phone_number',
        type: 'string',
        default: '',
        required: true,
        description: 'The phone number to send the message to',
        ...displayOptions
    },
    {
        displayName: 'Account Number',
        name: 'account_number',
        type: 'string',
        default: '',
        required: true,
        description: 'The account number associated with the message',
        ...displayOptions
    },
    {
        displayName: 'Open Ticket',
        name: 'open_ticket',
        type: 'boolean',
        default: false,
        required: false,
        description: 'Whether to open a ticket or not',
        ...displayOptions
    }
]

