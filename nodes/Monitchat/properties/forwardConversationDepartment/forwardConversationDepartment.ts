import { INodeProperties } from "n8n-workflow";

const displayOptions = {
    displayOptions: {
        show: {
            operation: ['forwardConversationDepartment'],
        }
    }
}

export const forwardConversationDepartmentProperties: INodeProperties[] = [
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
        displayName: 'Department',
        name: 'departmentId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getDepartments',
        },
        default: '',
        required: true,
        description: 'Selecione um departamento do seu sistema',
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

