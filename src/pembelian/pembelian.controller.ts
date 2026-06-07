import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { PembelianService } from "./pembelian.service";
import { CreatePembelianDto } from "./pembelian.dto";
import { UpdatePembelianDto } from "./pembelian.dto";

@Controller("pembelian")
export class PembelianController {
  constructor(private pembelianService: PembelianService) {}

  @Post()
  create(@Body() dto: CreatePembelianDto) {
    return this.pembelianService.create(dto);
  }

  @Get()
  findAll() {
    return this.pembelianService.findAll();
  }

  
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.pembelianService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePembelianDto
  ) {
    return this.pembelianService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.pembelianService.remove(id);
  }
}
