import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatcherService } from './matcher.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway()
export class MatcherGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly matcherService: MatcherService) {}
  afterInit(server: any) {
    console.log('init');
  }
  handleConnection(client: any, ...args: any[]) {
    console.log('connected');
  }
  handleDisconnect(client: any) {
    console.log('disconnected');
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('match')
  async handleMessage(client: any, payload: any) {
    console.log(payload.user);
    const { userName, avatar, createdAt } = payload.user;
    const result = {
      userName,
      message: payload.message,
      createdAt,
      avatar,
    };
    this.server.to(payload.roomId).emit('message', result);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: any, payload: any) {
    const { topic } = payload;
    const room = await this.matcherService.getRoomOrCreate(topic);
    client.join(room.id.toString());
    this.server.to(room.id.toString()).emit('join2', {
      totalClient: this.server.sockets.adapter.rooms[room.id.toString()].length,
      user: payload.user,
      topic,
    });
    client.emit('join', room);
  }
  @SubscribeMessage('leaveRoom')
  leaveRoom(client: any, payload: any) {
    client.leave(payload.roomId);
  }
}
