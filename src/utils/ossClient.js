/*
 * @Author: zwc 6537397+uni-yunApp@user.noreply.gitee.com
 * @Date: 2024-06-03 10:11:32
 * @LastEditors: zwc 6537397+uni-yunApp@user.noreply.gitee.com
 * @LastEditTime: 2024-06-05 09:15:25
 * @FilePath: \oss-utils\src\utils\ossClient.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
class OssClient {
  constructor(params) {
    if(!params || typeof params !=='object'){
      throw new Error('parameter is Required');
    }else{
      const arr = ['bucketKey','env','axiosFun',]
      for(let i of arr){
        if(!params[i]){
          throw new Error(`parameter ${i} is Required`)
        }
      }
      let obj = params.axiosFun.create()
      const type =  typeof obj.request === 'function'
      if(!type){
        throw new Error('Please pass in axios');
      }
    }
    this.bucketKey = params.bucketKey
    this._ossInfo = ''
    this.HCP = params.HCP
    this.axios = params.axiosFun
    this.loading = false
    this.env = params.env
   // this.Message = Message
    this.envConfig = {
      dev: 'https://ihome-test.3weijia.com',
      test: 'https://api.iwo72.net',
      sit: 'https://api.iwo72.net',
      pre: 'https://pre-api.i72.com',
      prod: 'https://api.i72.com',
    }
    this.getOssInfo()
  }
  // 接口加载配置
  async getOssInfo() {
    try {
      this.loading = true
      const res = await this.axios.post(
        this.envConfig[this.env] + '/basems/oss/getOssSignToken',
        {
          bucketKey: this.bucketKey,
        },
        {
          headers: {
            HCP: this.HCP,
            'Content-Type': 'application/json; charset=utf-8',
            'x-requested-with': 'XMLHttpRequest',
            sysCode: 'ihomeum',
            isSaas: true,
          },
        }
      )
      if (res && res.data.success) {
        this._ossInfo = res.data.result
      } else {
       // this.Message.warning('获取上传配置信息失败')
       new Error('获取上传配置信息失败')
      }
      this.loading = false
    } catch (error) {
     // this.Message.warning('获取上传配置信息失败')
      this.loading = false
      new Error('获取上传配置信息失败')
    }
  }

  // 检查存在配置时是否过期
  checkOssExpiration() {
    if (this._ossInfo) {
      if (new Date().getTime() < new Date(this._ossInfo.expiration).getTime()) {
        return true
      } else {
        return false
      }
    }
    return true
  }

  // 获取client
  client() {
    console.log('配置加载---', this._ossInfo, this.loading)
    if (!this._ossInfo) {
      if (this.loading) {
        // this.Message.warning('上传配置加载中，请稍后重试')
      } else {
       // this.Message.warning('上传配置加载失败，重新尝试中')
        location.reload()
        this.getOssInfo()
        new Error('上传配置加载失败，重新尝试中')
      }
      return
    }
    if (!this.checkOssExpiration()) {
    //  this.Message.warning('上传凭证过期，正在重新获取中，请稍后...')
      
      location.reload()
      this.getOssInfo()
      new Error('上传凭证过期，正在重新获取中，请稍后...')
      return
    }
    return this._ossInfo
  }
  uploadFile(file,isOverWriteValue) {
    console.log('files----', file, this.axios)
    // 是否禁止文件覆盖,可选参数，不传就默认为true
    const isOverWrite = isOverWriteValue || true
    const oss = this.client()
    const formData = new FormData()
    const fileType = file.type.split('/')[1]
    const name = file.name.split(`.${fileType}`)[0]
    formData.append('x-oss-forbid-overwrite', isOverWrite)
    formData.append('x-oss-security-token', oss.securityToken)
    formData.append('key', `${name}${file.uid}.${fileType}`)
    formData.append('policy', oss.policy)
    formData.append('OSSAccessKeyId', oss.accessKeyId)
    formData.append('success_action_status', '200')
    formData.append('signature', oss.signature)
    formData.append('file', file)
   
    return new Promise(async (resove, reject) => {
      try {
        const res = await this.axios.post(oss.writeUrl, formData)
        console.log('res----', res)
        if (res.status === 200) {
          resove({
            uid: file.uid,
            url: `${oss.readUrl}/${name}${file.uid}.${fileType}`,
            name:`${name}${file.uid}.${fileType}`,
          })
        } else {
          console.log('上传失败了', res)
          resove(false)
        }
        console.log('上传成功了吗', res)
      } catch (error) {
        console.log('error--', error)
        //this.Message.warning('上传文件失败,请刷新页面重试')
        reject(error)
        new Error('上传文件失败,请刷新页面重试')
        
      }
    })
  }
}

export default OssClient
