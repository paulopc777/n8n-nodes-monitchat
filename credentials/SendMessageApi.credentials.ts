import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class SendMessageApi implements ICredentialType {
    name = 'SendMessageApi';
    displayName = 'Monitchat API';
    documentationUrl = 'https://api-v2.monitchat.com/docs/#send-text';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                'Authorization': 'Bearer {{$credentials.apiKey}}'
            }
        },
    } as IAuthenticateGeneric;
}