import { ICredentialTestFunction, IDataObject, IExecuteFunctions, ILoadOptionsFunctions, ILocalLoadOptionsFunctions, INodeExecutionData, INodeListSearchResult, INodePropertyOptions, INodeType, INodeTypeDescription, IRequestOptions, NodeParameterValueType, ResourceMapperFields } from 'n8n-workflow';
import { sendMessageProperties } from './properties/sendMessage/sendMessage.properties';
import { sendCommentProperties } from './properties/sendComment/sendComment.properties';
import { forwardConversationProperties } from './properties/forwardConversation/forwardConversation';


async function getUsers(this: ILoadOptionsFunctions) {
    const response = await this.helpers.request({
        method: 'GET',
        url: 'https://api-v4.monitchat.com/api/v1/user?take=50&filter[0][0]=active&filter[0][1]=%3D&filter[0][2]=1&order=is_online&orderDirection=desc', // Substitua pelo endpoint da sua API
        headers: {
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXV0aC5tb25pdGNoYXQuY29tXC9sb2dpbiIsImlhdCI6MTc0Njc5MDI4NCwiZXhwIjoxNzQ2ODc2Njg0LCJuYmYiOjE3NDY3OTAyODQsImp0aSI6Im9XYlJENlJDRXV2VXJGUVgiLCJzdWIiOjYyNzIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.EPBdIVwMpDAqAyysUL622AGF4h5xG9Dq74-y7Y0AhMw`,
        },
    });

    const json = JSON.parse(response);
    const users = json.data;

    return users.map((user: { id: string, name: string }) => ({
        name: user.name,
        value: user.id,
    }));
}

export class Monitchat implements INodeType {
    methods?: { loadOptions?: { [key: string]: (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>; }; listSearch?: { [key: string]: (this: ILoadOptionsFunctions, filter?: string, paginationToken?: string) => Promise<INodeListSearchResult>; }; credentialTest?: { [functionName: string]: ICredentialTestFunction; }; resourceMapping?: { [functionName: string]: (this: ILoadOptionsFunctions) => Promise<ResourceMapperFields>; }; localResourceMapping?: { [functionName: string]: (this: ILocalLoadOptionsFunctions) => Promise<ResourceMapperFields>; }; actionHandler?: { [functionName: string]: (this: ILoadOptionsFunctions, payload: IDataObject | string | undefined) => Promise<NodeParameterValueType>; }; } | undefined;
    
    constructor() {
        this.methods = {
            loadOptions: {
                getUsers: getUsers,
            },
        };
    }

    description: INodeTypeDescription = {
        displayName: 'Monitchat',
        name: 'monitchat',
        icon: 'file:monitchat.png',
        group: ['transform'],
        version: 1,
        description: 'Send messages to Monitchat',
        defaults: {
            name: 'Monitchat',
        },
        inputs: ['main'] as any,
        outputs: ['main'] as any,
        credentials: [
            {
                name: 'monitchat',
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
                    {
                        name: 'Send Comment',
                        value: 'sendComment',
                        description: 'Send a comment to Monitchat',
                        action: 'Send a comment to monitchat',
                    },
                    {
                        name: 'Forward Conversation',
                        value: 'forwardConversation',
                        description: 'Forward a conversation to Monitchat',
                        action: 'Forward a conversation to monitchat',
                    }
                ],
                default: 'sendMessage',
                required: true,
            },
            ...sendMessageProperties,
            ...sendCommentProperties,
            ...forwardConversationProperties,
        ]
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < items.length; i++) {
            if (operation === 'sendMessage') {
                // Get credentials
                const credentials = await this.getCredentials('monitchat');

                // Get parameters
                const message = this.getNodeParameter('message', i) as string;
                const phoneNumber = this.getNodeParameter('phone_number', i) as string;
                const accountNumber = this.getNodeParameter('account_number', i) as string;
                const openTicket = this.getNodeParameter('open_ticket', i) as boolean;

                // Prepare request options
                const options: IRequestOptions = {
                    method: 'POST',
                    uri: 'https://api-v2.monitchat.com/api/v1/message',
                    body: {
                        message,
                        token: credentials.apiKey,
                        phone_number: phoneNumber,
                        account_number: accountNumber,
                        open_ticket: openTicket,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${credentials.apiKey}`,
                    },
                    json: true,
                };

                // Make the API request
                try {
                    const response = await this.helpers.request(options);
                    returnData.push({
                        json: response,
                        pairedItem: {
                            item: i,
                        },
                    });
                } catch (error) {

                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {
                                error: error.message,
                            },
                            pairedItem: {
                                item: i,
                            },
                        });
                        continue;
                    }
                    throw error;
                }
            }
            if (operation == 'sendComment') {
                // Get credentials
                const credentials = await this.getCredentials('monitchat');

                // Get parameters
                const comment = this.getNodeParameter('comment', i) as string;
                const phoneNumber = this.getNodeParameter('phone_number', i) as string;
                const accountNumber = this.getNodeParameter('account_number', i) as string;
                const openTicket = this.getNodeParameter('open_ticket', i) as boolean;

                // Prepare request options
                const options: IRequestOptions = {
                    method: 'POST',
                    uri: 'https://api-v2.monitchat.com/api/v1/comment',
                    body: {
                        comment,
                        token: credentials.apiKey,
                        phone_number: phoneNumber,
                        account_number: accountNumber,
                        open_ticket: openTicket,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${credentials.apiKey}`,
                    },
                    json: true,
                };

                // Make the API request
                try {
                    const response = await this.helpers.request(options);
                    returnData.push({
                        json: response,
                        pairedItem: {
                            item: i,
                        },
                    });
                } catch (error) {

                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {
                                error: error.message,
                            },
                            pairedItem: {
                                item: i,
                            },
                        });
                        continue;
                    }
                    throw error;
                }
            }
        }

        return [returnData];
    }
}