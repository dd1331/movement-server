import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsDto } from './dto/news-dto';

@Injectable()
export class NewsService {
  create(createNewsDto: CreateNewsDto) {
    return 'This action adds a new news';
  }

  async findAll(): Promise<NewsDto[]> {
    const ulList: NewsDto[] = [];
    const html = await this.getHtml();
    const $ = cheerio.load(html.data);
    const $bodyList = $('section.article-list-content').children(
      'div.list-block',
    );
    const urlPrefix = 'http://www.newspenguin.com/news';
    $bodyList.each((i, elem) => {
      const imageArray = $(elem).find('.list-image').attr('style').split('(.');
      imageArray[0] = urlPrefix;
      imageArray[1] = imageArray[1].slice(0, -1);
      const newsInfoArray = $(elem)
        .find('.list-dated')
        .text()
        .trim()
        .split(' | ');
      const url =
        urlPrefix.replace('/news', '') +
        $(elem).find('.list-titles a').attr('href').trim();
      ulList[i] = {
        title: $(elem).find('strong').text(),
        image: imageArray.join(''),
        summary: $(elem).find('.list-summary a').text().trim(),
        writer: newsInfoArray[1],
        writtenAt: new Date(newsInfoArray[2]),
        url,
      };
    });
    return ulList;
  }
  async getHtml() {
    try {
      return await axios.get(
        'http://www.newspenguin.com/news/articleList.html?view_type=sm',
      );
    } catch (error) {
      console.error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} news`;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}