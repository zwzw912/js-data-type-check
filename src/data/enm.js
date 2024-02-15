// 要和my-input-rule下的一致
const JS_DATA_TYPE = {
  STRING: "string",
  DATE: "date",
  DATE_TIME: "date_time",
  NUMBER: "number",
  FLOAT:`float`,
  DECIMAL:`decimal`,
  TINYINT: "tinyint",
  SMALLINT: "smallint",
  MEDIUMINT:"mediumint",
  INT: "int",
//   BIGINT: "bigint",
  NAN: "nan",
  INFINITY: "infinity",
  
  BOOLEAN: "boolean",
  REGEXP: "regexp",
  ARRAY: "array",
  OBJECT: "object",
  

  FUNCTION: "function",
  NULL: "null",
  UNDEFINED: "undefined",
  SYMBOL: "symbol", 

  UNKNOWN: "unknown",
};

const SIGN_UNSIGN = {
  UNSIGNED: "unsigned",
  SIGNED: "signed",
};
module.exports = {
  JS_DATA_TYPE,
  SIGN_UNSIGN,
}