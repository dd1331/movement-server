import { Injectable } from '@nestjs/common';
import { CreateWingmanDto } from './dto/create-wingman.dto';
import { UpdateWingmanDto } from './dto/update-wingman.dto';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PostsService } from '../posts/posts.service';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class WingmanService {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}
  create(createWingmanDto: CreateWingmanDto) {
    return 'This action adds a new wingman';
  }

  async crawlInstizFreeBoard() {
    const listUrl = 'https://www.instiz.net/name?category=1';
    const html = await this.getHtml(listUrl);
    const $ = cheerio.load(html.data);
    const $bodyList = $('#mainboard').children().children();
    const urlList = this.getUrlList($, $bodyList);
    const users: User[] = await this.usersService.findWingmanUsers();
    const wingman: User = users[Math.floor(Math.random() * users.length)];
    const posts = await Promise.all(
      urlList.map(async (url) => {
        const html = await this.getHtml(url);
        const $ = cheerio.load(html.data);
        const title = $('.tb_top').find('#nowsubject a').text().trim();
        const createdAt = $('.tb_lr.minitext').find('span').attr('title');
        const content = $('.memo_content').text().trim();
        const result = { title, createdAt, content };
        return result;
      }),
    );

    await Promise.all(
      posts.map(async (post) => {
        const dto: CreatePostDto = {
          ...post,
          poster: wingman.id,
          category: 'free',
        };
        return await this.postsService.createPostByWingman(dto);
      }),
    );
  }
  getUrlList($, $bodyList) {
    const urlPrefix = 'https://www.instiz.net';
    const urlList = [];

    $bodyList.each((i, elem) => {
      try {
        const isLocked = $(elem).find('.listsubject .minitext').html();
        const url =
          urlPrefix + $(elem).find('.listsubject a').attr('href').slice(2);
        if (!isLocked) urlList.push(url);
      } catch (error) {}
    });
    return urlList;
  }
  async getHtml(url) {
    try {
      return await axios.get(url);
    } catch (error) {}
  }

  findOne(id: number) {
    return `This action returns a #${id} wingman`;
  }

  update(id: number, updateWingmanDto: UpdateWingmanDto) {
    return `This action updates a #${id} wingman`;
  }

  remove(id: number) {
    return `This action removes a #${id} wingman`;
  }
}
