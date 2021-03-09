import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { S3 } from 'aws-sdk';
import { UploadFileDto } from './dto/upload-file.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    private awsService: AwsService,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {}
  async createFile(dto: CreateFileDto): Promise<File> {
    const createdFile = await this.fileRepo.create(dto);
    await this.fileRepo.save(createdFile);
    return createdFile;
  }
  async upload(file): Promise<File> {
    const { originalname } = file;
    const bucketS3 = 'movement-seoul';
    const { Location, ETag, Key } = await this.uploadS3(
      file.buffer,
      bucketS3,
      originalname,
    );
    const uploadFileDto = {
      url: Location,
      eTag: ETag,
      key: Key,
      size: file.size,
      type: file.type,
    };
    const createdFile = await this.createFile(uploadFileDto);
    return createdFile;
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };
    return await s3.upload(params).promise();
    // console.log('res2', res);
    // return res.Location;

    // return new Promise((resolve, reject) => {
    //   s3.upload(params, (err, data) => {
    //     if (err) {
    //       console.log(err);
    //       reject(err.message);
    //     }
    //     console.log('data', data);
    //     resolve(data);
    //   });
    // });
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2',
    });
  }
  create(createAwDto) {
    return 'This action adds a new aw';
  }

  findAll() {
    return `This action returns all aws`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aw`;
  }

  update(id: number, updateAwDto) {
    return `This action updates a #${id} aw`;
  }

  remove(id: number) {
    return `This action removes a #${id} aw`;
  }
}