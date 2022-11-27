import { ILogger } from "src/domain/logger/logger.interface";
import { TodoM } from "src/domain/model/todo";
import { TodoRepository } from "src/domain/repositories/todoRepository.interface";

export class addTodoUseCases {
  constructor(private readonly logger: ILogger, private readonly todoRepository: TodoRepository) {}

  async execute(content: string): Promise<void> {
    const todo = new TodoM();
    todo.content = content;
    todo.isDone = false;
    const result = await this.todoRepository.insert(todo);
    this.logger.log('addTodoUseCases execute', 'New todo have been inserted');
  }
}