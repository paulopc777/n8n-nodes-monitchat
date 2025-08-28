import { INodeProperties } from "n8n-workflow";

const displayOptions = {
    displayOptions: {
        show: {
            operation: ['changeTicketStatus'],
        }
    }
}

export const changeTicketStatusProperties: INodeProperties[] = [
    {
        displayName: 'Ticket id',
        name: 'conversation_id',
        type: 'string',
        default: '',
        required: true,
        description: 'The conversation_id to send',
        ...displayOptions
    },
    {
        displayName: 'Status',
        name: 'statusId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getTicketStatus',
        },
        default: '',
        required: true,
        description: 'Selecione um status do seu sistema',
        ...displayOptions
    }
]

