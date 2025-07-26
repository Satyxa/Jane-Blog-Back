import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageType, WFFPNAAPage } from './wff-pnaa-pages.model';
import { Quote } from './quote.model';
import { SliderImage } from './slider-image.model';

@Injectable()
export class AdminPagesRepository {
  constructor(
    @InjectRepository(WFFPNAAPage)
    protected WFFPNAAPageRepository: Repository<WFFPNAAPage>,
    @InjectRepository(Quote)
    protected QuoteRepository: Repository<Quote>,
    @InjectRepository(SliderImage)
    protected SliderImageRepository: Repository<SliderImage>,
  ) {}

  async save() {
    await this.QuoteRepository.save({ author: 'test', text: 'test' });
    await this.WFFPNAAPageRepository.save({
      title: 'test',
      text: 'test',
      imagesUrls: [],
      pageType: PageType.PNAA,
    });
    await this.WFFPNAAPageRepository.save({
      title: 'test',
      text: 'test',
      imagesUrls: [],
      pageType: PageType.WFF,
    });
  }

  async updateQuote(payload: { author: string; text: string }) {
    return await this.QuoteRepository.updateAll(payload);
  }

  async updateWffOrPnaa(payload: Omit<WFFPNAAPage, 'id'>) {
    return await this.WFFPNAAPageRepository.update(
      { pageType: payload.pageType },
      { ...payload },
    );
  }

  async saveSliderImage(payload: { url: string }) {
    return await this.SliderImageRepository.save(payload);
  }

  async getWffPnaaPage(pageType: PageType) {
    return await this.WFFPNAAPageRepository.findOneBy({ pageType });
  }

  async getQuote() {
    return await this.QuoteRepository.find();
  }

  async getSliderImages() {
    return await this.SliderImageRepository.find();
  }

  async deleteSliderImage(payload: { url: string }) {
    return await this.SliderImageRepository.delete({ url: payload.url });
  }
}
