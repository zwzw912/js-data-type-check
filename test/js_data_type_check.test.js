/**
 * Created by 张伟 on 2020/1/5.
 */
'use strict'
/*被测函数*/
// const {base,extend}=require('../dist/dataTypeCheck-min')
const env=require("./env").env
let base,extend,mysql,get_data_type,JS_DATA_TYPE,SIGN_UNSIGN
if("pack"===env){
    base=require('../dist/js-data-type-check-umd.min').base
    extend=require('../dist/js-data-type-check-umd.min').extend
    mysql=require('../dist/js-data-type-check-umd.min').mysql
    get_data_type=require('../dist/js-data-type-check-umd.min').get_data_type
    JS_DATA_TYPE=require('../dist/js-data-type-check-umd.min').JS_DATA_TYPE
    SIGN_UNSIGN=require('../dist/js-data-type-check-umd.min').SIGN_UNSIGN

}else{
    base=require('../src/js_data_type_check').base
    extend=require('../src/js_data_type_check').extend
    mysql=require('../src/js_data_type_check').mysql
    get_data_type=require('../src/js_data_type_check').get_data_type
    JS_DATA_TYPE=require('../src/data/enm').JS_DATA_TYPE
    SIGN_UNSIGN=require('../src/data/enm').SIGN_UNSIGN
}
const _=require('lodash')
const assert=require('assert')
const os=require('os')
const moment=require("moment")

describe('all test', function() {
    if('Windows_NT'!==os.type()){
        console.error('test case not support run in linux')
        return
    }


    let  testData=new Array()
    testData[0]=1
    testData[1]=1.99999999999999999999999       //是否当成整数2处理
    testData[2]=1.9999999                       //是否当成浮点数
    testData[3]=-1
    testData[4]=-0.000000000000000000000001     //小于1的值会被用科学计数法表示，所以不会是整数
    testData[5]=true
    testData[6]='true'                          //是否当成boolean处理
    testData[7]=[]
    testData[8]='[]'                            //是否当成boolean处理
    testData[9]={}
    testData[10]='{}'
    testData[11]=null
    testData[12]='null'
    testData[13]=undefined
    testData[14]='undefined'
    testData[15]=NaN
    testData[16]='NaN'
    testData[17]=Infinity
    testData[18]='Infinity'
    testData[19]='2019-10-10'
    testData[20]='2019-13-13'                   //invalid date
    testData[21]=''
    testData[22]='C:/'
    testData[23]='C:/Windows/win.ini'
    testData[24]=/a/i

    testData[25]=new Date().toLocaleString()                  //带中文的字符   date_time
    testData[26]=new Date().toISOString()                  //字符   date_time
    testData[27]=moment().toISOString()             //字符   date_time
    testData[28]=moment().add(1,'days').toISOString()                   //字符   date_time
    testData[29]='2012-10-10 00:00:00'                   //true
    let expectResult=new Array(testData.length)
    console.log(testData)
    describe('base', function() {
        //Rest all expected data to false
        beforeEach(function(){
            expectResult.fill(false)
        })

        it('base.isArray',function(){
            expectResult[7]=true
            let realResult=[]
            testData.map(x=>realResult.push(_.isArray(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })

        it('base.isObject',function(){
            expectResult[9]=true
            let realResult=[]
            testData.map(x=>realResult.push(base.isObject(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })

        it('base.isString',function(){
            expectResult[6]=true
            expectResult[8]=true
            expectResult[10]=true
            expectResult[12]=true
            expectResult[14]=true
            expectResult[16]=true
            expectResult[18]=true
            expectResult[19]=true
            expectResult[20]=true
            expectResult[21]=true
            expectResult[22]=true
            expectResult[23]=true
            expectResult[25]=true   //字符形式的日期
            expectResult[26]=true   //字符形式的日期
            expectResult[27]=true   //字符形式的日期
            expectResult[28]=true   //字符形式的日期
            expectResult[29]=true   //字符形式的日期时间
            let realResult=[]
            testData.map(x=>realResult.push(_.isString(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })

        it('base.isDate',function(){
            expectResult[19]=true
            expectResult[20]=false

            expectResult[25]=false  //带中文
            expectResult[26]=false
            expectResult[27]=false
            expectResult[28]=false
            expectResult[29]=false
            let realResult=[]
            testData.map(x=>realResult.push(base.isDate(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })
        it('base.isDateTime',function(){
            expectResult[19]=false
            expectResult[20]=false

            expectResult[25]=false  //带中文
            expectResult[26]=true
            expectResult[27]=true
            expectResult[28]=true
            expectResult[29]=true
            let realResult=[]
            testData.map(x=>realResult.push(base.isDateTime(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })
        it('base.isInteger',function(){
            expectResult[0]=true
            expectResult[1]=true
            expectResult[3]=true
            // expectResult[4]=true
            let realResult=[]
            // testData.map(x=>realResult.push(base.isInt(x)))
            testData.map(x=>realResult.push(_.isInteger(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })

        it('base.isNumber',function(){
            expectResult[0]=true
            expectResult[1]=true
            expectResult[2]=true
            expectResult[3]=true
            expectResult[4]=true
            let realResult=[]
            testData.map(x=>realResult.push(base.isNumber(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })

        it('base.isFloat',function(){
            expectResult[2]=true
            expectResult[4]=true
            let realResult=[]
            testData.map(x=>realResult.push(base.isFloat(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })

        it('base.isBoolean',function(){
            expectResult[5]=true
            let realResult=[]
            testData.map(x=>realResult.push(_.isBoolean(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })

        it('base.isRegExp',function(){
            expectResult[24]=true
            let realResult=[]
            testData.map(x=>realResult.push(_.isRegExp(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })

        it('base.isStringDate',function(){
            let newTestData=[
                1,
                "1",
                1.1,
                "1.1",
                "abd",
                "1899-01-01",//只能处理20/21世纪的日期
                "1900-13-21",//月份错误
                "1900-3-21",//月份错误
                "1900-02-31",//日期错误
                "1900-12-41",//日期错误
                "1900-12-1",//日期错误
                "2021-11-14"
            ]
            let newExpectResult=new Array(newTestData.length).fill(false)
            newExpectResult[11]=true
            let realResult=[]
            newTestData.map(x=>realResult.push(base.isStringDate(x)))
            assert.deepStrictEqual(realResult.join(' '),newExpectResult.join(' '))
        })
        it('base.isStringDateTime',function(){
            let newTestData=[
                1,
                "1",
                1.1,
                "1.1",
                "abd",
                "2021-11-14Z",
                "2021-11-14Z24:12:12",
                "2021-11-14Z23:60:12",
                "2021-11-14Z23:00:60",
                "2021-11-14 23:00:50Z", // idx:9
                "2021-11-14T23:00:50Z", //
                "2021-11-14T23:00:50  ",//用trim，去掉了结尾的空白，所以能pass
                "2021-11-14 23:00:50  ",//不能有1个以上空白，但是内部会把结尾的空白去掉
                "2021-11-14  23:00:50  ",//不能有1个以上空白，但是内部会把结尾的空白去掉
                "2021-11-14T23:00:50.120Z",//带毫秒
            ]
            let newExpectResult=new Array(newTestData.length).fill(false)
            newExpectResult[9]=true
            newExpectResult[10]=true
            newExpectResult[11]=true
            newExpectResult[12]=true
            newExpectResult[13]=false
            newExpectResult[14]=true
            // newExpectResult[12]=true
            let realResult=[]
            newTestData.map(x=>realResult.push(base.isStringDateTime(x)))
            assert.deepStrictEqual(realResult.join(' '),newExpectResult.join(' '))
        })
    })


    describe('extend', function() {
        //Rest all expected data to false
        beforeEach(function(){
            expectResult.fill(false)
        })

        it('extend.isSetValue',function(){
            expectResult.fill(true)
            expectResult[11]=false
            expectResult[13]=false
            let realResult=[]
            testData.map(x=>realResult.push(extend.isSetValue(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })
        it('extend.isEmpty',function(){
            expectResult[7]=true
            expectResult[9]=true
            expectResult[11]=true
            expectResult[13]=true
            expectResult[21]=true
            let realResult=[]
            testData.map(x=>realResult.push(extend.isEmpty(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })
        it('extend.isNumberNegative',function(){
            expectResult[3]=true
            expectResult[4]=true
            let realResult=[]
            testData.map(x=>realResult.push(base.isNumber(x) && extend.isNumberNegative(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })
        it('extend.isNumberPositive',function(){
            expectResult[0]=true
            expectResult[1]=true
            expectResult[2]=true
            let realResult=[]
            testData.map(x=>realResult.push(base.isNumber(x) && extend.isNumberPositive(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })
/*        it('extend.isFolder',function(){
            expectResult[22]=true
            let realResult=[]
            testData.map(x=>realResult.push(extend.isFolder(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })
        it('extend.isFile',function(){
            expectResult[23]=true
            let realResult=[]
            testData.map(x=>realResult.push(extend.isFile(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })*/
/*        it('base.isFileReadable',function(){
            expectResult[23]=true
            let realResult=[]
            testData.map(x=>realResult.push(extend.isFileReadable(x)))
            assert.deepStrictEqual(realResult.join(' '),expectResult.join(' '))
        })*/
    })

    describe('mysql', function() {
        let testDataSign=[
            [-129,128,-128,127,0],
            [-32769,32768,-32768,32767,0],
            [-8388609,8388608,-8388608,8388607,0],
            [-2147483649,2147483648,-2147483648,2147483647,0],
            [-9223372036854775809n,9223372036854775808n,-9223372036854775808n,9223372036854775807n,0],
        ]
        let testDataUnsign=[
            [-1,256,0,255],
            [-1,65536,0,65535],
            [-1,16777216,0,16777215],
            [-1,4294967296,0,4294967295],
            [-1,18446744073709551616n,0,18446744073709551615n],
        ]

        let unsign,func,data
        it('mysql.isTinyInt unsign is false',function(){
            unsign=false
            func=mysql.isTinyInt
            data=testDataSign[0]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),true)
            assert.deepStrictEqual(func(data[3],unsign),true)
            assert.deepStrictEqual(func(data[4],unsign),true)
        })
        it('mysql.isSmallInt unsign is false',function(){
            unsign=false
            func=mysql.isSmallInt
            data=testDataSign[1]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),true)
            assert.deepStrictEqual(func(data[3],unsign),true)
            assert.deepStrictEqual(func(data[4],unsign),true)
        })
        it('mysql.isMediumInt unsign is false',function(){
            unsign=false
            func=mysql.isMediumInt
            data=testDataSign[2]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),true)
            assert.deepStrictEqual(func(data[3],unsign),true)
            assert.deepStrictEqual(func(data[4],unsign),true)
        })
        it('mysql.isInt unsign is false',function(){
            unsign=false
            func=mysql.isInt
            data=testDataSign[3]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),true)
            assert.deepStrictEqual(func(data[3],unsign),true)
            assert.deepStrictEqual(func(data[4],unsign),true)
        })
/*        it('mysql.isBigInt unsign is false',function(){
            unsign=false
            func=mysql.isBigInt
            data=testDataSign[4]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),false)
            assert.deepStrictEqual(func(data[3],unsign),false)
            assert.deepStrictEqual(func(data[4],unsign),true)
        })*/



        unsign=true
        it('mysql.isTinyInt unsign is true',function(){
            unsign=true
            func=mysql.isTinyInt
            data=testDataUnsign[0]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),true)
            assert.deepStrictEqual(func(data[3],unsign),true)
            // assert.deepStrictEqual(func(data[4],unsign),true)
        })
        it('mysql.isSmallInt unsign is true',function(){
            unsign=true
            func=mysql.isSmallInt
            data=testDataUnsign[1]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),true)
            assert.deepStrictEqual(func(data[3],unsign),true)
            // assert.deepStrictEqual(func(data[4],unsign),true)
        })
        it('mysql.isMediumInt unsign is true',function(){
            unsign=true
            func=mysql.isMediumInt
            data=testDataUnsign[2]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),true)
            assert.deepStrictEqual(func(data[3],unsign),true)
            // assert.deepStrictEqual(func(data[4],unsign),true)
        })
        it('mysql.isInt unsign is true',function(){
            unsign=true
            func=mysql.isInt
            data=testDataUnsign[3]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),true)
            assert.deepStrictEqual(func(data[3],unsign),true)
            // assert.deepStrictEqual(func(data[4],unsign),true)
        })
/*        it('mysql.isBigInt unsign is true',function(){
            unsign=true
            func=mysql.isBigInt
            data=testDataUnsign[4]
            assert.deepStrictEqual(func(data[0],unsign),false)
            assert.deepStrictEqual(func(data[1],unsign),false)
            assert.deepStrictEqual(func(data[2],unsign),false)
            assert.deepStrictEqual(func(data[3],unsign),true)
            // assert.deepStrictEqual(func(data[4],unsign),true)
        })*/
    })
    describe('get_data_type', function() {
        it('negative float',function(){
            assert.deepStrictEqual(get_data_type(-12.7),[JS_DATA_TYPE.FLOAT,SIGN_UNSIGN.SIGNED])
        })
        it('positive float',function(){
            assert.deepStrictEqual(get_data_type(12.7),[JS_DATA_TYPE.FLOAT,SIGN_UNSIGN.UNSIGNED])
        })
        it('negative tinyint',function(){
            assert.deepStrictEqual(get_data_type(-127),[JS_DATA_TYPE.TINYINT,SIGN_UNSIGN.SIGNED])
        })
        it('positive tinyint',function(){
            assert.deepStrictEqual(get_data_type(128),[JS_DATA_TYPE.TINYINT,SIGN_UNSIGN.UNSIGNED])
        })
        it('negative smallint',function(){
            assert.deepStrictEqual(get_data_type(-129),[JS_DATA_TYPE.SMALLINT,SIGN_UNSIGN.SIGNED])
        })
        it('positive smallint',function(){
            assert.deepStrictEqual(get_data_type(65535),[JS_DATA_TYPE.SMALLINT,SIGN_UNSIGN.UNSIGNED])
        })
        it('negative mediumint',function(){
            assert.deepStrictEqual(get_data_type(-32769),[JS_DATA_TYPE.MEDIUMINT,SIGN_UNSIGN.SIGNED])
        })
        it('positive mediumint',function(){
            assert.deepStrictEqual(get_data_type(16777215),[JS_DATA_TYPE.MEDIUMINT,SIGN_UNSIGN.UNSIGNED])
        })
        it('negative int',function(){
            assert.deepStrictEqual(get_data_type(-8388609),[JS_DATA_TYPE.INT,SIGN_UNSIGN.SIGNED])
        })
        it('positive int',function(){
            assert.deepStrictEqual(get_data_type(4294967295),[JS_DATA_TYPE.INT,SIGN_UNSIGN.UNSIGNED])
        })
        it('NaN',function(){
            assert.deepStrictEqual(get_data_type(NaN),[JS_DATA_TYPE.NAN,SIGN_UNSIGN.SIGNED])
        })
        it('POS infinite',function(){
            assert.deepStrictEqual(get_data_type(Infinity),[JS_DATA_TYPE.INFINITY,SIGN_UNSIGN.UNSIGNED])
        })
        it('NEG infinite',function(){
            assert.deepStrictEqual(get_data_type(-Infinity),[JS_DATA_TYPE.INFINITY,SIGN_UNSIGN.SIGNED])
        })

        it('string date',function(){
            assert.deepStrictEqual(get_data_type('2012-10-10'),[JS_DATA_TYPE.STRING,JS_DATA_TYPE.DATE])
        })
        it('string ivalid date',function(){
            assert.deepStrictEqual(get_data_type('2012-13-10'),[JS_DATA_TYPE.STRING])
        })

        it('string date time',function(){
            assert.deepStrictEqual(get_data_type('2012-10-10 10:10:10'),[JS_DATA_TYPE.STRING,JS_DATA_TYPE.DATE_TIME])
        })
        it('string date time with T Z',function(){
            assert.deepStrictEqual(get_data_type('2012-10-10T10:10:10Z'),[JS_DATA_TYPE.STRING,JS_DATA_TYPE.DATE_TIME])
        })
        it('string invlid date time',function(){
            assert.deepStrictEqual(get_data_type('2012-13-10 10:10:10T'),[JS_DATA_TYPE.STRING])
        })
        it('string date time with time 00:00:00',function(){
            assert.deepStrictEqual(get_data_type('2012-12-10 00:00:00'),[JS_DATA_TYPE.STRING,JS_DATA_TYPE.DATE_TIME])
        })

        it('object',function(){
            assert.deepStrictEqual(get_data_type({}),[JS_DATA_TYPE.OBJECT])
        })

        it('array',function(){
            assert.deepStrictEqual(get_data_type([]),[JS_DATA_TYPE.ARRAY])
        })

        it('function',function(){
            assert.deepStrictEqual(get_data_type(function(){}),[JS_DATA_TYPE.FUNCTION])
        })

        it('date',function(){
            assert.deepStrictEqual(get_data_type(new Date()),[JS_DATA_TYPE.DATE])
        })
    })
})
