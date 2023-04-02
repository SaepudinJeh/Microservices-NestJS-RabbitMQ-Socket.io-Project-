import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('Chat Gateway');

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('event')
  onEvent(
    @MessageBody() message: { sender: string; room: string; message: string },
    client: Socket,
  ) {
    console.log('message', message);
    return this.wss.to(message.room).emit('event', message);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string) {
    console.log('joinedRoom', room);
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string) {
    console.log('leftRoom', room);
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
