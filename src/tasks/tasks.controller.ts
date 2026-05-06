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
  findAll() {
    return this.tasksService.findAll();
  }

  // Obtener task por id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  // Actualizar task
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<Task>,
  ) {
    return this.tasksService.update(id, body);
  }

  // Eliminar task
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}