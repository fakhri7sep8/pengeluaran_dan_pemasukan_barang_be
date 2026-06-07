import { Controller, Get, Post, Body, Patch, Param } from "@nestjs/common";
import { PenjualanService } from "./penjualan.service";
import { CreatePenjualanDto, UpdatePenjualanDto } from "./penjualan.dto";

@Controller("penjualan")
export class PenjualanController {
  constructor(private penjualanService: PenjualanService) {}

  @Post()
  create(@Body() dto: CreatePenjualanDto) {
    return this.penjualanService.create(dto);
  }

  @Get()
  findAll() {
    return this.penjualanService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.penjualanService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdatePenjualanDto,
  ) {
    return this.penjualanService.update(+id, dto);
  }
}
