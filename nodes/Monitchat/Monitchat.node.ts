import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, IRequestOptions } from 'n8n-workflow';

export class Monitchat implements INodeType {
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
                ],
                default: 'sendMessage',
                required: true,
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                default: '',
                required: true,
                description: 'The message to send',
            },
            {
                displayName: 'Phone Number',
                name: 'phone_number',
                type: 'string',
                default: '',
                required: true,
                description: 'The phone number to send the message to',
            },
            {
                displayName: 'Account Number',
                name: 'account_number',
                type: 'string',
                default: '',
                required: true,
                description: 'The account number associated with the message',
            },
            {
                displayName: 'Open Ticket',
                name: 'open_ticket',
                type: 'boolean',
                default: false,
                required: true,
                description: 'Whether to open a ticket or not',
            }
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
        }

        return [returnData];
    }
}