import { INodeProperties } from "n8n-workflow";

const displayOptions = {
    displayOptions: {
        show: {
            operation: ['forwardConversation'],
        }
    }
}

export const forwardConversationProperties: INodeProperties[] = [
    {
        displayName: 'Conversation ID',
        name: 'conversation_id',
        type: 'string',
        default: '',
        required: true,
        description: 'The conversation_id to send',
        ...displayOptions
    },
    {
        displayName: 'Usuário',
        name: 'userId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getUsers',
        },
        default: '',
        required: true,
        description: 'Selecione um usuário do seu sistema',
        ...displayOptions
    },
    {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        required: false,
        description: 'The comment to send',
        ...displayOptions
    }
]

