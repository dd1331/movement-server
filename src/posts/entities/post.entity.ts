import { CommonEntity } from '../../common.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';
import { File } from '../../files/entities/file.entity';
import { ChildComment } from '../../comments/entities/child_comment.entity';
import { PostHashtag } from './post_hashtag.entity';

@Entity()
export class Post extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.posts)
  poster: number;

  @Column()
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ default: 0, nullable: true })
  views: number;

  @Column()
  category: string;

  @Column({ default: 0, nullable: true, name: 'like_count' })
  likeCount: number;

  @Column({ default: 0, nullable: true, name: 'dislike_count' })
  dislikeCount: number;

  @OneToMany(() => File, (file) => file.post)
  files: File[];

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany((type) => ChildComment, (comment) => comment.post)
  childComments: ChildComment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => PostHashtag, (postHashtag) => postHashtag.post)
  postHashtags: PostHashtag[];
}
