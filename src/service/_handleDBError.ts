// src/service/_handleDBError.ts
import ServiceError from '../core/serviceError';

const handleDBError = (error: any) => {

  const { code = '', message } = error;

  if (code === 'P2002') {
    switch (true) {
      case message.includes('idx_circuit_name_unique'):
        throw ServiceError.validationFailed(
          'A circuit with this name already exists',
        );
      default:
        throw ServiceError.validationFailed('This item already exists');
    }
  }

  if (code === 'P2025') {
    switch (true) {
      // foreign keys
      case message.includes('fk_result_race'):
        throw ServiceError.notFound('This race does not exist');
      case message.includes('fk_result_driver'):
        throw ServiceError.notFound('This driver does not exist');
      case message.includes('fk_race_circuit'):
        throw ServiceError.notFound('This circuit does not exist');

      // models
      case message.includes('circuit'):
        throw ServiceError.notFound('No circuit with this id exists');
      case message.includes('race'):
        throw ServiceError.notFound('No race with this id exists');
      case message.includes('result'):
        throw ServiceError.notFound('No result with this id exists');
      case message.includes('driver'):
        throw ServiceError.notFound('No driver with this id exists');
    }
  }

  if (code === 'P2003') {
    switch (true) {
      case message.includes('circuit_id'):
        throw ServiceError.conflict(
          'This circuit does not exist or is still linked to races',
        );
      case message.includes('driver_id'):
        throw ServiceError.conflict(
          'This driver does not exist or is still linked to results',
        );
      case message.includes('race_id'):
        throw ServiceError.conflict(
          'This race does not exist or is still linked to results',
        );
    }
  }

  // Rethrow error because we don't know what happened
  throw error;
};

export default handleDBError; // 👈 1
