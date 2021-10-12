// SQL queries
export const GET_All_USERS_DTO =
  'select u.id, u.email, u.refreshtoken, u.isactivated, u.activationcode, r.name as role ' +
  'from users as u left join roles as r on u.roleid=r.id ';

// Errors
export const ACCESS_DENIED = 'Access denied';
export const BAD_REQUEST = 'Bad request';
export const FORBIDDEN = 'Access forbidden';
export const INTERNAL_SERVER_ERROR = 'Internal server error';
export const NOT_FOUND_ERROR = 'Entity not found';
export const UNAUTHORIZED = 'Unauthorized';
