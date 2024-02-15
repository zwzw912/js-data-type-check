/**
 * Created by 张伟 on 2023-09-27.
 * github密码丢失，无法更改data-type-check,所以新开一个包
 */
'use strict'
const moment=require("moment")
const _=require("lodash")
const {JS_DATA_TYPE,SIGN_UNSIGN}=require('./data/enm')
//基本类型检测
const base= {
    isObject(obj){
        //return obj && typeof obj === 'object' && Object == obj.constructor;
        //如果添加obj的话，和bool值&&后，变成obj，而不是bool了
        // ‘’ && false 等于 ''       false  && ''   等于 false
        //null && false 等于 null         false  && null   等于 false
        //undefined && false 等于 undefined           false  && undefined   等于 false
        //null也是object，所以需要排除
        return typeof obj === 'object' && obj!==null && Object == obj.constructor;
    },

    //检查是否有效日期; 返回boolean
    //只接受字符形式的日期
    isDate(date) {
        let parseDate=moment(date,['YYYY-MM-DD',moment.ISO_8601],true)
        

        if(parseDate.isValid() ){
            let datePartString=parseDate.format('YYYY-MM-DD')
            
            return datePartString===date
        }else{
            return false
        }
        
    },
    isDateTime(date){        
        let parseDate=moment(date,['YYYY-MM-DD',moment.ISO_8601],true)        
        if(parseDate.isValid() ){
            let datePartString=parseDate.format('YYYY-MM-DD')
            
            return datePartString!==date
        }else{
            return false
        }
    },

    //数字只考虑有限数字
    isNumber(value) {
        return typeof value === 'number' && false===Number.isNaN(value) && true===Number.isFinite(value)
    },
    //如果不是整数，就是浮点。注意浮点会四舍五入，1.9999999999999999===2，从而变成int
    //只考虑有限数字
    isFloat(value){
        //this.Int已经排除了NaN
        return typeof value === 'number' && false === _.isInteger(value) && true===Number.isFinite(value)
    },

    /** 从客户端输入的日期，必须是字符形式，以便用正则进行过滤。因为moment当前会接受整数（包括字符形式的整数），转换成合法的日期。
     * */
    isStringDate(value,reg=/^(?:19|20)\d{2}-(?:0\d|1[1-2])-(?:0\d|[1-2]\d|3[0-1])/){
        //首先判断是否为字符
        if(false===_.isString(value)){
            return false
        }
        //然后判断是否正确匹配（大致匹配）
        if(false===reg.test(value)){
            return false
        }
        //最后用moment判断是否合法
        return moment(value).isValid()
    },
    isStringDateTime(value,reg=/^(?:19|20)\d{2}-(?:0\d|1[1-2])-(?:0\d|[1-2]\d|3[0-1])(?:\s|T)(?:[0|1]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d{3})?(?:\s*|Z)?$/){
        //首先判断是否为字符
        if(false===_.isString(value)){
            return false
        }
        value=value.trim()
        //然后判断是否正确匹配（大致匹配）
        if(false===reg.test(value)){
            return false
        }
        //最后用moment判断是否合法
        return moment(value).isValid()
    }
}

//扩展检测
const extend={
    //变量是否已经赋值
    isSetValue(variant){
        return (undefined !== variant && null !== variant)
    },
    //已经赋值，赋的值是不是为空（string:空字符串；object:{},array:[]），数值:NaN/Infinity都认为不是空
    isEmpty(value) {
        //没有赋值，认为是空
        if (false===this.isSetValue(value)){
            return true
        }

        if(_.isString(value)){
            //"" === value  和 0 === value.length 的效果等价，取其中之一即可
            return (0 === value.length || "" === value.trim());
        }
        if(base.isObject(value)){
            return 0 === Object.keys(value).length
        }
        if(_.isArray(value)){
            return  0 === value.length
        }
        //其他类型（例如数值 NaN/Infinity），默认不空
        return false
    },
    //必须保证传入的变量是Number
    isNumberPositive(value) {
        // return base.isNumber(value)  && Math.sign(value) === 1
        return  Math.sign(value) === 1
    },
    //必须保证传入的变量是Number
    isNumberNegative(value) {
        return Math.sign(value) === -1
    },
}
// const {log}=console
const mysql={
    /*
    *   @value:
    *   @unsign：是否为无符号，默认是无符号
    *   return; boolean
    *   */
    isTinyInt(value,unsign=true){
        if(false===_.isInteger(value)){
            return false
        }    
        if(true===unsign){
            return value>=0 && value<=255
        }else{
            return value>=-128 && value<=127
        }
    },
    isSmallInt(value,unsign=true){
        if(false===_.isInteger(value)){
            return false
        }
        if(true===unsign){
            return value>=0 && value<=65535
        }else{
            return value>=-32768 && value<=32767
        }
    },
    isMediumInt(value,unsign=true){
        if(false===_.isInteger(value)){
            return false
        }
        if(true===unsign){
            return value>=0 && value<=16777215
        }else{
            return value>=-8388608 && value<=8388607
        }
    },
    isInt(value,unsign=true){
        if(false===_.isInteger(value)){
            return false
        }
        if(true===unsign){
            return value>=0 && value<=4294967295
        }else{
            return value>=-2147483648 && value<=2147483647
        }
    },
    //JS中，bigInt使用n表示。
    //为了避免混淆，mysql不使用bigint
/*    isBigInt(value,unsign=true){
        if(false===_.isInteger(value)){
            return false
        }
        if(true===unsign){
            return value>=0 && value<=18446744073709551615n
        }else{
            return value>=-9223372036854775808n && value<=9223372036854775807n
        }
    },*/
}

/* 
*   @value: 要检测的数据
*   @toSubType: 是否返回子类型，例如：number可以细分为int/float等
*   return: JS_DATA_TYPE
*   */
function get_data_type(value){
    let dataType=Object.prototype.toString.call(value).slice(8,-1).toLowerCase()
    // console.log('dataType:',dataType)
    let sign
    switch(dataType){
        case 'number':
            sign=Math.sign(value)===1?SIGN_UNSIGN.UNSIGNED:SIGN_UNSIGN.SIGNED
            console.log('value:',value,'dataType:',dataType,"sign:",sign)
            if(base.isFloat(value)){
                return [JS_DATA_TYPE.FLOAT,sign]
            }
            //  顺序很重要，例如1可以是tiny、small、medium、int，但很明显，期望是tiny，所以要从小到大排除
            if(mysql.isTinyInt(value,sign===SIGN_UNSIGN.UNSIGNED)){
                return [JS_DATA_TYPE.TINYINT,sign]
            }
            if(mysql.isSmallInt(value,sign===SIGN_UNSIGN.UNSIGNED)){
                return [JS_DATA_TYPE.SMALLINT,sign]
            }
            if(mysql.isMediumInt(value,sign===SIGN_UNSIGN.UNSIGNED)){
                return [JS_DATA_TYPE.MEDIUMINT,sign]
            }                
            if(mysql.isInt(value,sign===SIGN_UNSIGN.UNSIGNED)){
                return [JS_DATA_TYPE.INT,sign]
            } 
            // NaN
            if(Number.isNaN(value)){
                return [JS_DATA_TYPE.NAN,sign]
            }  
            //infinity            
            if(false===Number.isFinite(value)){
                return [JS_DATA_TYPE.INFINITY,sign]
            }            
            return [JS_DATA_TYPE.UNKNOWN,sign] //my-input-rule中，没有对应的类型
        case 'boolean':
            return [JS_DATA_TYPE.BOOLEAN]
        case'string':
            if(base.isDate(value)){
                return [JS_DATA_TYPE.STRING,JS_DATA_TYPE.DATE]
            }
            if(base.isDateTime(value)){
                return [JS_DATA_TYPE.STRING,JS_DATA_TYPE.DATE_TIME]
            }

            return [JS_DATA_TYPE.STRING]
        case 'object':
            return [JS_DATA_TYPE.OBJECT]
        case 'array':
            return [JS_DATA_TYPE.ARRAY]
        case 'function':
            return [JS_DATA_TYPE.FUNCTION]
        case 'date':
            return [JS_DATA_TYPE.DATE]
        case 'undefined':
            return JS_DATA_TYPE.UNDEFINED
        case 'null':
            return JS_DATA_TYPE.NULL
        default:
            return JS_DATA_TYPE.UNKNOWN 
    }
    
}
module.exports={
    base,
    extend,
    mysql,
    get_data_type,
}
