import { INodeProperties } from "n8n-workflow";

const displayOptions = {
    displayOptions: {
        show: {
            operation: ['sendPhoto'],
        }
    }
}

export const sendPhotoProperties: INodeProperties[] = [
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
        displayName: 'File name',
        name: 'file_name',
        type: 'string',
        default: '',
        required: true,
        description: 'The file to send',
        ...displayOptions
    },
    {
        displayName: 'File URL',
        name: 'file_url',
        type: 'string',
        default: '',
        required: true,
        description: 'The URL of the file to send',
        ...displayOptions
    },

]

