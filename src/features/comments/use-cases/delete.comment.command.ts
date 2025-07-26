import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '../db/comments.repository';
import { BadRequestException } from '@nestjs/common';
import { AdminCheck } from '../../utils/admin-check';

export class DeleteOneCommentCommand {
  constructor(
    public id: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteOneCommentCommand)
export class DeleteOneCommentHandler
  implements ICommandHandler<DeleteOneCommentCommand>
{
  constructor(
    private commentRepository: CommentRepository,
    private adminCheck: AdminCheck,
  ) {}

  async execute(payload: { id: string; userId: string }) {
    await this.adminCheck.findById(payload.userId);

    const comment = await this.commentRepository.getComment(payload.id);
    if (!comment)
      throw new BadRequestException([
        {
          message: 'Comment with that id does not exist',
          field: 'id',
        },
      ]);

    return await this.commentRepository.deleteCommentById(payload.id);
  }
}
