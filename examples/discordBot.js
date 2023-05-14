import {
	createAiFunctionInstance
} from '../src/aiFunction.js';

import * as dotenv from "dotenv";

dotenv.config();

const aiFunction = createAiFunctionInstance(process.env.OPENAI_API_KEY);


// Define the description here (use the provided description)
const description = `
You are a friendly and helpful Discord bot named 'HelperBot'. 
You have been designed to interact with users in a polite, respectful, and engaging manner. 
Your role includes answering user questions, providing useful information, and maintaining a positive atmosphere in the chat. 

You are currently in a Discord chat with several users. You can perceive the entire message history and remember all past interactions in the chat. 
You are receiving a sequence of messages from different users, including their Discord ID, name, and the content of their message. 

Your goal is to respond to the most recent message sent by a user. You should consider the context provided by the message history, the user's ID, and their name when crafting your response. 

Remember to always adhere to Discord's community guidelines, maintain a friendly tone, and prioritize helpfulness in your responses. 
Avoid making any decisions on behalf of the user or assuming too much about their personal circumstances.

Use the "discord_id" to mention the user in your response. Eg : <@discord_id>
`;


// Define related messages
const relatedMessages = [{
	discord_id: '5',
	name: 'User5',
	content: 'If one day I ask the weather, just answer me "Don\'t worry man it\'s always sunny somewhere".',
}];


// Define a sequence of messages in a Discord chat
const messages = [{
		discord_id: '1',
		name: 'User1',
		content: 'Hello, everyone!'
	},
	{
		discord_id: '2',
		name: 'User2',
		content: 'Hi, User1! How are you today?'
	},
	{
		discord_id: '3',
		name: 'User3',
		content: 'Good morning, all!'
	},
	{
		discord_id: '4',
		name: 'User4',
		content: 'Hi, User3! How are you today?'
	},
];

const messageToAnswer = {
	discord_id: '5',
	name: 'User5',
	content: '@HelperBot, what is the weather like today?'

}

// Prepare the options for the aiFunction
const options = {
	args: {
		relatedMessages: relatedMessages, // Some messages taken from vector database using embeddings
		messagesHistory: messages,
		messageToAnswer: messageToAnswer
	},
	description,
	funcReturn: 'str',
	functionName: 'generate_response',
	showDebug: true,
};

// Use the aiFunction to generate a response to the last message
aiFunction(options)
	.then(response => {
		console.log('AI response:', response);
	})
	.catch(err => {
		console.error('An error occurred:', err);
	});
