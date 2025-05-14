import { INodeProperties } from "n8n-workflow";

const displayOptions = {
    displayOptions: {
        show: {
            operation: ['conversationAutoReply'],
        }
    }
}

export const conversationAutoReplyProperties: INodeProperties[] = [
    {
        displayName: 'Conversation ID',
        name: 'conversation_id',
        type: 'string',
        default: '',
        required: true,
        description: 'The conversation_id to change',
        ...displayOptions
    },
    {
        displayName: 'Auto Reply',
        name: 'auto_reply',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to send an auto reply or not',
        ...displayOptions
    }
]

