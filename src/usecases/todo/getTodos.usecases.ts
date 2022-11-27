import { TodoM } from "src/domain/model/todo";
import { TodoRepository } from "src/domain/repositories/todoRepository.interface";

export class getTodosUseCases {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(): Promise<TodoM[]> {
    return await this.todoRepository.findAll();
  }
}