import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class SendMessageApi implements ICredentialType {
    name = 'sendMessageApi';
    displayName = 'Monitchat API';
    documentationUrl = 'https://api-v2.monitchat.com/docs/#send-text';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
												typeOptions: { password: true },
            default: '',
        },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'Authorization': 'Bearer {{$credentials.apiKey}}'
            }
        },
    };
}