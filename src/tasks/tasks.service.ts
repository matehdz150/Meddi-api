import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { TaskQuery } from './types/task.types';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>, //inyeccion del modelo
  ) {}

  // Crear task
  async create(data: Partial<Task>) {
    //Puede no traer todas las propiedades del objeto, mongose se encarga de los defaults que se definen en el schema
    try {
      if (data.status === 'COMPLETED' && !data.completedAt) {
        //Si la task se crea con estado COMPLETED automaticamente completedAt se va a actualizar con la fecha actual
        data.completedAt = new Date();
      }

      const created = await this.taskModel.create(data); //Crear asincronamente la task

      return created; //regresamos la task ya creada
    } catch (error: any) {
      //Manejo de errores

      if (error?.name === 'ValidationError') {
        //si las reglas del esquema no se cumplen, se dispara un 404 BadRequest
        throw new BadRequestException(error.message);
      }

      if (error?.name === 'CastError') {
        //Si no es un tipo esperado por mongo, por ejemplo: fecha invalida o un id no valido
        throw new BadRequestException('Invalid field type');
      }

      // Error del servidor 505
      throw new InternalServerErrorException('Error creating task');
    }
  }

  //Eliminar Task
  async delete(id: string) {
    try {
      const deleted = await this.taskModel.findByIdAndDelete(id); //Intentar borrar el task por id

      if (!deleted) {
        //Manejo de error de task no encontrada
        throw new NotFoundException('Task not found');
      }

      return {
        message: 'Task deleted successfully',
      };
    } catch (error: any) {
      //Manejo de errores

      if (error?.name === 'CastError') {
        throw new BadRequestException(`Invalid value for field: ${error.path}`); //Si el id no es un objeto de id valido de mongose o algun campo no coincide con el tipo esperado
      }

      throw new InternalServerErrorException('Error deleting task'); //Error del servidor
    }
  }

  async update(id: string, data: Partial<Task>) {
    //Puede no traer todas las propiedades del objeto, mongose se encarga de los defaults que se definen en el schema
    try {
      if (data.status === 'COMPLETED') {
        data.completedAt = new Date();
      } //si se actualiza el estado a completed, se acualiza completedAt a la hora de ejecucion

      if (data.status === 'PENDING') {
        data.completedAt = undefined;
      } //si se actualiza el estado a pending, simplemente de 'elimina' el completed at, si es que ya habia uno

      const task = await this.taskModel.findById(id); // buscamos la task por id

      if (!task) {
        throw new NotFoundException('Task not found'); //si no existe la task mandamosun 404 de not found
      }

      Object.assign(task, data); //asigna los nuevos valores a la task

      await task.save(); //guardamos los valores nuevos

      return task; //regresamos la task si todo salio bien
    } catch (error: any) {
      //manejo de errores
      if (error?.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }

      if (error?.name === 'CastError') {
        throw new BadRequestException(`Invalid value for field: ${error.path}`);
      }

      throw new InternalServerErrorException('Error updating task');
    }
  }

  async findAll(query: TaskQuery) {
    //para no dejar anys, hice un type con las querys aceptadas por findAll
    //Obtener todas las tasks
    try {
        //objeto para poder construir los filtros es como si fuera un mini contexto de los filtros
      const filter: {
        priority?: 'LOW' | 'MEDIUM' | 'HIGH';
        createdAt?: {
          $gte?: Date; //mayor o igual a que
          $lte?: Date; //menor o igual a que
        };
      } = {};

      //filtro por prioridad
      if (query.priority) {
        filter.priority = query.priority; //se agrega al filtro la prioridad, si es que viene en la query
      }

      //filtro por fechas
      if (query.startDate || query.endDate) {
        filter.createdAt = {};
        if (query.startDate) {
          filter.createdAt.$gte = new Date(query.startDate); //actualizamos el filtro
        }
        if (query.endDate) {
          filter.createdAt.$lte = new Date(query.endDate); //actualizamos el filtro
        }
      }

      // Ordenar por fecha de creación
      const sortOrder = query.sort === 'asc' ? 1 : -1; //si es ascendete va a sortorder va a ser 1 si no -1

      const tasks = await this.taskModel
        .find(filter)
        .sort({ createdAt: sortOrder }); //buscamos ahora si las tasks con los filtros ya aplicados.

      return tasks;
    } catch {
      throw new InternalServerErrorException('Error fetching tasks'); //Cualquier error del servidor
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.taskModel.findById(id); //buscar task por id

      if (!task) {
        throw new NotFoundException(`Task with id ${id} not found`); //si no existe la task devolvemos error
      }

      return task;
    } catch (error: any) {
      if (error?.name === 'CastError') {
        //Si no es un id valido
        throw new BadRequestException(`Invalid value for field: ${error.path}`);
      }

      throw new InternalServerErrorException('Error fetching task'); //cualquier error del servidor
    }
  }

  async groupByPriority() {
    try {
      // Traemos todas las tasks
      const tasks = await this.taskModel.find().sort({ createdAt: -1 });

      // Creamos un objeto con una lista vacía por cada prioridad
      const groupedTasks = {
        LOW: [],
        MEDIUM: [],
        HIGH: [],
      };

      // Recorremos cada tarea y la agregamos a la lista que le corresponde
      tasks.forEach((task) => {
        groupedTasks[task.priority].push(task);
      });

      return groupedTasks;
    } catch {
      throw new InternalServerErrorException(
        'Error grouping tasks by priority',
      );
    }
  }
}
