import { Controller, Get } from '@nestjs/common';
import { PositionsService } from './positions.service.js';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Get()
    findAll() {
        return this.positionsService.findAll();
    }
}
