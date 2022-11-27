import { TodoM } from "src/domain/model/todo";
import { TodoRepository } from "src/domain/repositories/todoRepository.interface";

export class GetTodoUseCases {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: number): Promise<TodoM> {
    return await this.todoRepository.findById(id);
  }
}