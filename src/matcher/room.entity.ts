import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '../common.entity';
import { RoomLog } from './room_log.entity';

@Entity()
export class Room extends CommonEntity {
  @OneToMany(() => RoomLog, (roomLog) => roomLog.room)
  roomLog: [RoomLog];

  @Column()
  topic: string;
}