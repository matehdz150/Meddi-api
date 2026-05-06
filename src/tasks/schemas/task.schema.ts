import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true }) //agregar automaticamente createdAt y updatedAt
export class Task {
  @Prop({ required: true })
  title!: string; //Titulo de la task, es obligatorio esta prop

  @Prop({ default: '' })
  description?: string; //Descripcion de la task, no es obligatoria

  @Prop({ enum: ['LOW', 'MEDIUM', 'HIGH'], required: true, index: true })
  priority!: string;
  //Prioridad de la task, para ordenar por prioridad las tasks. 
  //Decidi crear un indice en esta propiedad porque es un campo que se va a usar mucho y va a filtrar tasks frecuentemente

  @Prop({ enum: ['PENDING', 'COMPLETED'], default: 'PENDING', index: true })
  status!: string;
  //Estado de la task, ordenar tasks por su estado
  //Indexado porque es una propiedad que se va a usar mucho para filtrar

  @Prop()
  dueDate?: Date;
  //Fecha de vencimiento de la tarea

  @Prop()
  completedAt?: Date;
  //Fecha en la que se completo la tarea
}

export const TaskSchema = SchemaFactory.createForClass(Task);