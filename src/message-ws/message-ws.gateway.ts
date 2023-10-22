import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({cors: true, namespace: '/'})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server
  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService : JwtService
    ) {

    }
  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;// este parametro authentication lo madand desde el front
    console.log('token: ', token);
    let payload: JwtPayload
    try {
      payload = this.jwtService.verify(token)
      await this.messageWsService.registrClient(client, payload.id)

    } catch (error) {
      client.disconnect();
      return
    }

    console.log('payload: ', payload);
    console.log('handleConnection: Conectado', );


    console.log({conectados: this.messageWsService.getConectedClines()})

    this.wss.emit('clients-updated', this.messageWsService.getConectedClines()) //hacer una peticion con esta identificacion clients-updated
  }
  handleDisconnect(client: Socket) {
    console.log('handleDisconnect: Desconectado', );
    this.messageWsService.removeClient(client.id)

    console.log({conectados: this.messageWsService.getConectedClines()})
    this.wss.emit('clients-updated', this.messageWsService.getConectedClines())


  }

  @SubscribeMessage('message-from-client')
  handleMessageFronClient(client: Socket, payload: NewMessageDto){
    console.log('payload: ', payload);
    // console.log('client: ', client);
    // message-from-server
    this.wss.emit('message-from-server',{
      fullName: this.messageWsService.getUserFullNameBySocketId(client.id),
      message: payload.message
    } )
    // client.broadcast.emit('message-from-server',payload)//esto emite a todos menos a el mismo
  }
}
