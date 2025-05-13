import { ICredentialTestFunction, IDataObject, IExecuteFunctions, ILoadOptionsFunctions, ILocalLoadOptionsFunctions, INodeExecutionData, INodeListSearchResult, INodePropertyOptions, INodeType, INodeTypeDescription, IRequestOptions, NodeParameterValueType, ResourceMapperFields } from 'n8n-workflow';
import { sendMessageProperties } from './properties/sendMessage/sendMessage.properties';
import { sendCommentProperties } from './properties/sendComment/sendComment.properties';
import { forwardConversationUserProperties } from './properties/forwardConversation/forwardConversation';
import { forwardConversationDepartmentProperties } from './properties/forwardConversationDepartment/forwardConversationDepartment';


async function getUsers(this: ILoadOptionsFunctions) {
    const credentials = "e6fc0034-9a45-4038-a3cf-14f9b99f8d02";

    const response = await this.helpers.request({
        method: 'GET',
        url: 'https://api-v4.monitchat.com/api/v1/token/user',
        qs: {
            token: credentials
        },
        json: true,
    });

    const users = response.data;

    if (!users || !Array.isArray(users)) {
        throw new Error('Não foi possível obter a lista de usuários ou o formato da resposta é inválido');
    }

    return users.map((user: { id: string, name: string }) => ({
        name: user.name,
        value: user.id,
    }));
}

async function getDepartments(this: ILoadOptionsFunctions) {
    const credentials = "e6fc0034-9a45-4038-a3cf-14f9b99f8d02";

    const response = await this.helpers.request({
        method: 'GET',
        url: 'https://api-v4.monitchat.com/api/v1/token/departament',
        qs: {
            token: credentials
        },
        json: true,
    });

    const users = response.data;

    if (!users || !Array.isArray(users)) {
        throw new Error('Não foi possível obter a lista de usuários ou o formato da resposta é inválido');
    }

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
                getDepartments: getDepartments
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
        ], requestDefaults: {
            baseURL: 'https://api-v2.monitchat.com/api/v1',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            json: true,
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
                        name: 'Forward Conversation from User',
                        value: 'forwardConversationUser',
                        description: 'Forward a conversation from user to Monitchat',
                        action: 'Forward a conversation from user to monitchat',
                    },
                    {
                        name: 'Forward Conversation from Department',
                        value: 'forwardConversationDepartment',
                        description: 'Forward a conversation from department to Monitchat',
                        action: 'Forward a conversation from department to monitchat',
                    }
                ],
                default: 'sendMessage',
                required: true,
            },
            ...sendMessageProperties,
            ...sendCommentProperties,
            ...forwardConversationUserProperties,
            ...forwardConversationDepartmentProperties,
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
                const openTicket = this.getNodeParameter('open_ticket', i) as boolean;                // Prepare request options
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
                const conversation_id = this.getNodeParameter('conversation_id', i) as string;
                const comment = this.getNodeParameter('comment', i) as string;                // Prepare request options
                const options: IRequestOptions = {
                    method: 'POST',
                    uri: `https://api-v4.monitchat.com/api/v1/token/comment-conversation/${conversation_id}`,
                    body: {
                        token: credentials.apiKey,
                        reason: comment
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

            if (operation == 'forwardConversationUser') {
                // Get credentials
                const credentials = await this.getCredentials('monitchat');

                // Get parameters
                const conversation_id = this.getNodeParameter('conversation_id', i) as string;
                const userId = this.getNodeParameter('userId', i) as string;
                const Comment = this.getNodeParameter('comment', i) as string;                // Prepare request options
                const options: IRequestOptions = {
                    method: 'POST',
                    uri: `https://api-v4.monitchat.com/api/v1/token/forward-conversation/${conversation_id}`,
                    body: {
                        token: credentials.apiKey,
                        user: userId,
                        reason: Comment,
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

            if (operation == 'forwardConversationDepartment') {
                // Get credentials
                const credentials = await this.getCredentials('monitchat');

                // Get parameters
                const conversation_id = this.getNodeParameter('conversation_id', i) as string;
                const departmentId = this.getNodeParameter('departmentId', i) as string;
                const comment = this.getNodeParameter('comment', i) as string;                // Prepare request options
                const options: IRequestOptions = {
                    method: 'POST',
                    uri: `https://api-v4.monitchat.com/api/v1/token/forward-conversation/${conversation_id}`,
                    body: {
                        token: credentials.apiKey,
                        department: departmentId,
                        reason: comment,
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