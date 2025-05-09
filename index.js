module.exports = {
    packageName: 'n8n-nodes-monitchat',
    nodeTypes: {
        credentials: [
            'dist/credentials/Monitchat.credentials.js'
        ],
        nodes: [
            'dist/nodes/Monitchat/Monitchat.node.js',
            'dist/nodes/Monitchat/SendMessage.node.js'
        ]
    }
};