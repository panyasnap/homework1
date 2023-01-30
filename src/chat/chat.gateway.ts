import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
// import { AppService } from './app.service';
// import { Chat } from './chat.entity';
import { SupportService } from './support.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private supportService: SupportService) {}
  @WebSocketServer() server: Server;
  // @SubscribeMessage('sendMessage')
  // async handleSendMessage(client: Socket, payload): Promise<void> {
  //   //  await this.appService.createMessage(payload);
  //   // this.server.emit('recMessage', payload);
  // }

  afterInit(server: Server) {
    console.log(server);
    //Выполняем действия
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Выполняем действия
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
    //Выполняем действия
  }

  sendMessage() {
    this.server.sockets.emit('receiveMessage', {
      text: 'text',
      author: 'author',
    });
  }
}
