const error_code=require('./src/data/error_code').BASE_ERROR_CODE
const error=require('./src/data/error').ERROR
const wrap_upload=require('./src/wrap_mysql2')
const generator=require('./src/util/generator')
module.exports={
    error_code,
    error,
    wrap_upload,
    generator,
}