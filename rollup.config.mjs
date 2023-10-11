// const commonjs=require("@rollup/plugin-commonjs") //使得require生效（包含代码）
// const terser=require("@rollup/plugin-terser") //代码压缩
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
export default {
    input: "./index.js",
    
    output: [
        {   //可以处理es/cjs
            file: './dist/js-data-type-check-umd.min.js',
            // format: 'umd',
            name: 'js-data-type-check',
            format: 'umd',
            plugins: [terser()],
            //当入口文件有export时，'umd'格式必须指定name
            //这样，在通过<script>标签引入时，才能通过name访问到export的内容。
            // sourcemap:true  // 生成xxxxxx.js.map文件，方便调试
        },
        // {
        //     file: './dist/tencent-es.js',
        //     format: 'es',
        //     sourcemap:true  // 生成xxxxxx.js.map文件，方便调试
        // },
        // {   //使用require包含模块，就用cjs（commonJS），缺点是require后，不能智能提示
        //     file: './dist/tencent-cjs.min.js',
        //     format: 'cjs',
        //     plugins: [terser()],
        //     // sourcemap:true  // 生成xxxxxx.js.map文件，方便调试
        // }
    ],
    plugins: [ 
        commonjs({
            //ignore: ['conditional-runtime-dependency'],
	        //ignoreDynamicRequires:['test/env.js']
        }) 
    ]
}