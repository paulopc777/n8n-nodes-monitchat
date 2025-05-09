import { INodeProperties } from "n8n-workflow";

const displayOptions = {
    displayOptions: {
        show: {
            operation: ['sendComment'],
        }
    }
}

export const sendCommentProperties: INodeProperties[] = [
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
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        required: true,
        description: 'The comment to send',
        ...displayOptions
    }
]

