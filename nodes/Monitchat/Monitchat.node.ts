import { ICredentialTestFunction, IDataObject, IExecuteFunctions, ILoadOptionsFunctions, ILocalLoadOptionsFunctions, INodeExecutionData, INodeListSearchResult, INodePropertyOptions, INodeType, INodeTypeDescription, IRequestOptions, NodeParameterValueType, ResourceMapperFields } from 'n8n-workflow';
import { sendMessageProperties } from './properties/sendMessage/sendMessage.properties';
import { sendCommentProperties } from './properties/sendComment/sendComment.properties';
import { forwardConversationUserProperties } from './properties/forwardConversation/forwardConversation';
import { forwardConversationDepartmentProperties } from './properties/forwardConversationDepartment/forwardConversationDepartment';
import { conversationAutoReplyProperties } from './properties/conversationAutoReply/conversationAutoReply.properties';
import { sendPhotoProperties } from './properties/sendPhoto/sendPhoto.properties';
import { changeTicketStatusProperties } from './properties/changeTicketStatus/changeTicketStatus';


async function getUsers(this: ILoadOptionsFunctions) {
    const credentials = await this.getCredentials('monitchat')
    const response = await this.helpers.request({
        method: 'GET',
        url: 'https://api-v4.monitchat.com/api/v1/token/user',
        qs: {
            token: credentials.apiKey
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
    const credentials = await this.getCredentials('monitchat')
    const response = await this.helpers.request({
        method: 'GET',
        url: 'https://api-v4.monitchat.com/api/v1/token/departament',
        qs: {
            token: credentials.apiKey
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

async function getTicketStatus(this: ILoadOptionsFunctions) {
    const credentials = await this.getCredentials('monitchat')
    const response = await this.helpers.request({
        method: 'GET',
        url: `https://api-v4.monitchat.com/api/v1/token/ticket-status`,
        qs: {
            token: credentials.apiKey
        },
        json: true,
    });

    const ticket = response.data;

    if (!ticket) {
        throw new Error('Não foi possível obter o status do ticket');
    }

    return ticket.map((status: { id: string, description: string }) => ({
        value: status.id,
        name: status.description,
    }));
}

export class Monitchat implements INodeType {
    methods?: { loadOptions?: { [key: string]: (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>; }; listSearch?: { [key: string]: (this: ILoadOptionsFunctions, filter?: string, paginationToken?: string) => Promise<INodeListSearchResult>; }; credentialTest?: { [functionName: string]: ICredentialTestFunction; }; resourceMapping?: { [functionName: string]: (this: ILoadOptionsFunctions) => Promise<ResourceMapperFields>; }; localResourceMapping?: { [functionName: string]: (this: ILocalLoadOptionsFunctions) => Promise<ResourceMapperFields>; }; actionHandler?: { [functionName: string]: (this: ILoadOptionsFunctions, payload: IDataObject | string | undefined) => Promise<NodeParameterValueType>; }; } | undefined;

    constructor() {
        this.methods = {
            loadOptions: {
                getUsers: getUsers,
                getDepartments: getDepartments,
                getTicketStatus: getTicketStatus
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
        usableAsTool: true,
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
                        name: 'Send Photo',
                        value: 'sendPhoto',
                        description: 'Send a photo to Monitchat',
                        action: 'Send a photo to monitchat',
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
                    },
                    {
                        name: 'Conversation Auto Reply',
                        value: 'conversationAutoReply',
                        description: 'Change a conversation auto reply to Monitchat',
                        action: 'Change a conversation auto reply to monitchat',
                    },
                    {
                        name: 'Change Ticket Status',
                        value: 'changeTicketStatus',
                        description: 'Change the status of a ticket in Monitchat',
                        action: 'Change the status of a ticket in monitchat',
                    }
                ],
                default: 'sendMessage',
                required: true,
            },
            ...sendMessageProperties,
            ...sendCommentProperties,
            ...forwardConversationUserProperties,
            ...forwardConversationDepartmentProperties,
            ...conversationAutoReplyProperties,
            ...sendPhotoProperties,
            ...changeTicketStatusProperties
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

            if (operation == "conversationAutoReply") {
                // PUT https://api-v4.monitchat.com/api/v1/token/conversation-auto-reply/4262103
                const credentials = await this.getCredentials('monitchat');

                const auto_reply = this.getNodeParameter('auto_reply', i) as boolean;
                const conversation_id = this.getNodeParameter('conversation_id', i) as string;
                const options: IRequestOptions = {
                    method: 'PUT',
                    uri: `https://api-v4.monitchat.com/api/v1/token/conversation-auto-reply/${conversation_id}`,
                    body: {
                        token: credentials.apiKey,
                        active: auto_reply
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

            if (operation == "sendPhoto") {
                // https://api-v2.monitchat.com/api/v1/media/send
                const credentials = await this.getCredentials('monitchat');
                const message = this.getNodeParameter('message', i) as string;
                const phoneNumber = this.getNodeParameter('phone_number', i) as string;
                const accountNumber = this.getNodeParameter('account_number', i) as string;
                const fileName = this.getNodeParameter('file_name', i) as string;
                const fileUrl = this.getNodeParameter('file_url', i) as string;
                const fileType = this.getNodeParameter('file_type', i) as string;
                // Prepare request options
                const options: IRequestOptions = {
                    method: 'POST',
                    uri: `https://api-v2.monitchat.com/api/v1/media/send`,
                    body: {
                        token: credentials.apiKey,
                        message: message,
                        phone_number: phoneNumber,
                        account_number: accountNumber,
                        type: fileType,
                        name: fileName,
                        file_name: fileName,
                        url: fileUrl,
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

            if(operation == "changeTicketStatus") {
                const credentials = await this.getCredentials('monitchat');
                const conversationId = this.getNodeParameter('conversation_id', i) as string;
                const statusId = this.getNodeParameter('statusId', i) as string;

                // Prepare request options
                const options: IRequestOptions = {
                    method: 'POST',
                    uri: `https://api-v2.monitchat.com/api/v1/token/setTicketStatus`,
                    body: {
                        token: credentials.apiKey,
                        status_id: statusId,
                        data: conversationId
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