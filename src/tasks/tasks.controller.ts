import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';
import { Query } from '@nestjs/common';
import type { TaskQuery } from './types/task.types';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {} //Inyeccion del servicio de tasks

  // Crear task
  @Post()
  create(@Body() body: Partial<Task>) {
    return this.tasksService.create(body);
  }

  // Obtener todas las tasks
  @Get()
  //filtros opcionales por query
  findAll(@Query() query: TaskQuery) {
    return this.tasksService.findAll(query);
  }

  // Obtener las tasks agrupadas por prioridad
  @Get('grouped-by-priority')
  groupByPriority() {
    return this.tasksService.groupByPriority();
  }

  // Obtener task por id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  // Actualizar task
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Task>) {
    return this.tasksService.update(id, body);
  }

  // Eliminar task
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
