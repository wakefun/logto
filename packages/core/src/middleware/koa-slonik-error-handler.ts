/**
 * Slonik Error Types:
 *
 *  BackendTerminatedError,
 *  CheckIntegrityConstraintViolationError,
 *  ConnectionError,
 *  DataIntegrityError,
 *  ForeignKeyIntegrityConstraintViolationError,
 *  IntegrityConstraintViolationError,
 *  InvalidConfigurationError,
 *  NotFoundError,
 *  NotNullIntegrityConstraintViolationError,
 *  StatementCancelledError,
 *  StatementTimeoutError,
 *  UnexpectedStateError,
 *  UniqueIntegrityConstraintViolationError,
 *  TupleMovedToAnotherPartitionError
 *
 * (reference)[https://github.com/gajus/slonik#error-handling]
 */

import type { SchemaLike } from '@logto/schemas';
import type { Middleware } from 'koa';
import { SlonikError, NotFoundError } from 'slonik';

import RequestError from '#src/errors/RequestError/index.js';
import { DeletionError, InsertionError, UpdateError } from '#src/errors/SlonikError/index.js';

export default function koaSlonikErrorHandler<StateT, ContextT>(): Middleware<StateT, ContextT> {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error: unknown) {
      if (!(error instanceof SlonikError)) {
        throw error;
      }

      if (error instanceof InsertionError) {
        throw new RequestError({
          code: 'entity.create_failed',
          status: 422,
          // Assert generic type of the Class instance
          // eslint-disable-next-line no-restricted-syntax
          name: (error as InsertionError<SchemaLike, SchemaLike>).schema.tableSingular,
        });
      }

      if (error instanceof UpdateError) {
        throw new RequestError({
          code: 'entity.not_exists',
          status: 404,
          // Assert generic type of the Class instance
          // eslint-disable-next-line no-restricted-syntax
          name: (error as UpdateError<SchemaLike, SchemaLike>).schema.tableSingular,
        });
      }

      if (error instanceof DeletionError || error instanceof NotFoundError) {
        throw new RequestError({
          code: 'entity.not_found',
          status: 404,
        });
      }

      throw error;
    }
  };
}
