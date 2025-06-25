import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class GameSession {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.gameSessions)
    user: User;

    @Column()
    score: number;

    @Column()
    level: number;

    @CreateDateColumn()
    startTime: Date;

    @Column({ nullable: true })
    endTime: Date;

    @Column({ default: false })
    completed: boolean;
} 