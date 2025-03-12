import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: true })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
