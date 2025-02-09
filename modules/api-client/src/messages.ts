import { 
  ApiContractMessages, 
  MessageSendRequest, 
  MessageSendResponse, 
  MessagesSearchRequest, 
  MessageNotification 
} from '@abot/api-contract/target/messages';
import { Message } from '@abot/model';

import APIClient from '.';

export default class APIClientMessages implements ApiContractMessages {
  constructor(public apiClient: APIClient) {}

  send(request: MessageSendRequest): Promise<MessageSendResponse> {
    return this.apiClient.execute('messages.send', request);
  }

  notify(message: MessageNotification): Promise<void> {
    return this.apiClient.execute('messages.notify', message);
  }

  search(request: MessagesSearchRequest): Promise<Message[]> {
    return this.apiClient.execute('messages.search', request);
  }
}
