export const UserRepositoryKey = 'USER_REPOSITORY';
export const OrderRepositoryKey = 'ORDER_REPOSITORY';
export const MysqlDatasourceKey = 'MYSQL_PROVIDER';

export function getNodeEnv(): 'local' | 'dev' | 'prod' | 'test' {
  switch (process.env.NODE_ENV?.toLowerCase()) {
    case 'local':
      return 'local';
    case 'test':
    case process.env.npm_lifecycle_event?.includes('test'):
      return 'test';
    case 'dev':
    case 'develop':
    case 'development':
      return 'dev';
    case 'prd':
    case 'prod':
    case 'production':
      return 'prod';
    default:
      return 'test';
  }
}

export let NODE_ENV: 'local' | 'dev' | 'prod' | 'test' = 'local';

const processNodeEnv = process.env.NODE_ENV?.toLowerCase();
if (processNodeEnv === 'local') {
  NODE_ENV = 'local';
} else if (
  processNodeEnv === 'test' ||
  process.env.npm_lifecycle_event?.includes('test')
) {
  NODE_ENV = 'test';
} else if (
  processNodeEnv === 'dev' ||
  processNodeEnv === 'develop' ||
  processNodeEnv === 'development'
) {
  NODE_ENV = 'dev';
} else if (
  processNodeEnv === 'prd' ||
  processNodeEnv === 'prod' ||
  processNodeEnv === 'production'
) {
  NODE_ENV = 'prod';
}

export const DEFAULT_ISOLATION_LEVEL:
  | 'READ UNCOMMITTED'
  | 'READ COMMITTED'
  | 'REPEATABLE READ'
  | 'SERIALIZABLE' = NODE_ENV == 'local' ? 'SERIALIZABLE' : 'REPEATABLE READ';
