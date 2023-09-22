import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UpdateBoardFigureDto } from '../dto/update-board-figure.dto';
import { BoardService } from '../service/board.service';
import { CreateBoardFigureDto } from '../dto/create-board-figure.dto';

@WebSocketGateway({ namespace: '/board', cors: true })
export class BoardGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly boardService: BoardService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('board:updateFigure')
  async handleUpdateFigure(
    @MessageBody() data: { id: string; figure: UpdateBoardFigureDto },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Socket received board:updateFigure => ', data);
    const { id: idBoard } = client.handshake.query;
    const { id: idFigure, figure } = data;
    const boardData = await this.boardService.updateBoardFigure(
      idBoard as string,
      idFigure,
      figure,
    );
    const newFigure = boardData.toJSON().figures.find((f) => f.id === idFigure);
    if (newFigure) {
      this.server.to(idBoard).emit('board:updateFigure', newFigure);
    }
  }

  @SubscribeMessage('board:createFigure')
  async handleCreateFigure(
    @MessageBody() data: { figure: CreateBoardFigureDto },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Socket received board:createFigure => ', data);
    const { id: idBoard } = client.handshake.query;
    const { figure } = data;
    const boardData = await this.boardService.createBoardFigure(
      idBoard as string,
      figure,
    );
    console.log(boardData);
    const newFigure = boardData.toJSON().figures[boardData.figures.length - 1];
    if (newFigure) {
      this.server.to(idBoard).emit('board:updateFigure', newFigure);
    }
  }

  handleConnection(client: Socket) {
    const { id } = client.handshake.query;
    client.join(id);
    console.log('Socket connected => ', client.id);
    console.log('Client join room => ', id);
  }

  handleDisconnect(clientId: string) {
    console.log('Socket Disconnected => ', clientId);
  }

  afterInit(server: Server) {
    if (server) console.log('Socket is live');
  }
}
