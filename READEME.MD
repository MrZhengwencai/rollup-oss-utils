<!--
 * @Author: zwc 6537397+uni-yunApp@user.noreply.gitee.com
 * @Date: 2024-06-04 14:40:24
 * @LastEditors: zwc 6537397+uni-yunApp@user.noreply.gitee.com
 * @LastEditTime: 2024-06-04 14:43:51
 * @FilePath: \oss-utils\READEME.MD
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
## 依赖安装
npm install oss-utils --save
## 项目中使用
import { OssClient } from 'oss-utils'
import Cookies from 'js-cookie'
import axios from 'axios'
new OssClient({ bucketKey: 'oss-test-ihome-customer-config', env: process.env.ENV_CONFIG, HCP: Cookies.get('HCP'), axiosFun: axios })
## 参数说明
bucketKey：OSS桶名称
env:环境变量
HCP: cookie中的HCP值
axiosFn: axios依赖库