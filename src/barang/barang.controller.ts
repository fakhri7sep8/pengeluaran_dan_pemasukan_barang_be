import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BarangService } from './barang.service';
import { CreateBarangDto, UpdateBarangDto } from './barang.dto';

@Controller('barang')
export class BarangController {
  constructor(private barangService: BarangService) {}

  @Get()
  findAll() {
    return this.barangService.findAll();
  }

  @Post()
  create(@Body() dto: CreateBarangDto) {
    return this.barangService.create(dto);
  }

    @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBarangDto,
  ) {
    return this.barangService.update(+id, dto);
  }
}
