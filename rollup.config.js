/*
 * @Author: zwc 6537397+uni-yunApp@user.noreply.gitee.com
 * @Date: 2024-05-31 14:36:24
 * @LastEditors: zwc 6537397+uni-yunApp@user.noreply.gitee.com
 * @LastEditTime: 2024-06-05 09:05:31
 * @FilePath: \oss-utils\rollup.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 */
import babel from '@rollup/plugin-babel';
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from '@rollup/plugin-terser';

export default {
  input: "src/main.js",
  output: [
    {
      file: "lib/index.js",
      format: "umd",
      name: 'ossUtils',
    },
    {
      file: "lib/index.cjs.js",
      format: "cjs",
    },
    {
      file: "lib/index.esm.js",
      format: "es",
    },
  ],
  plugins: [
  resolve(),
  commonjs(),
  babel({
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead' // 根据你的目标浏览器或者环境调整
          }
        ]
      ]
  }),
  terser({  
    compress: {  
      drop_console: true, // 删除所有的 `console` 语句  
      // ... 其他 Terser 压缩选项  
    },  
    output: {  
      // Terser 的 output 选项  
      comments: true, // 去除注释  
    },  
  }), 
  ]
};
