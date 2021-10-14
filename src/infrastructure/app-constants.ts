// SQL queries
export const GET_All_USERS_DTO = 'select * from alluserswithrolenames';
export const GET_ROLE_ID_BY_ROLE_NAME = 'SELECT getroleidbyrolename($1)';
export const CREATE_USER = 'CALL insert_user($1, $2, $3, $4, $5, $6)';
export const UPDATE_USER_EMAIL = 'CALL update_user_email($1, $2)';
export const UPDATE_USER_PASSWORD_HASH = 'CALL update_user_passwordhash($1, $2)';
// Errors
export const ACCESS_DENIED = 'Access denied';
export const BAD_REQUEST = 'Bad request';
export const FORBIDDEN = 'Access forbidden';
export const INTERNAL_SERVER_ERROR = 'Internal server error';
export const NOT_FOUND_ERROR = 'Entity not found';
export const UNAUTHORIZED = 'Unauthorized';
export const ALREADY_REGISTERED_ERROR = 'User already exists';
export const WRONG_PASSWORD_ERROR = 'Wrong password';

// JWT-constants
export const JWT_EXPIRATION_TIME = 1800;
export const JWT_EXPIRATION_TIME_FOR_REFRESH = 1209600;
