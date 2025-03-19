import ImageKit from 'imagekit-javascript'

const SERVER    = process.env.VUE_APP_SERVER
const publicKey = process.env.VUE_APP_IMAGEKIT_KEY
const folder    = process.env.VUE_APP_IMAGEKIT_FOLDER

const urlEndpoint            = 'https://ik.imagekit.io/ei5p3fotk'
const authenticationEndpoint =  SERVER + '/api/auxi/imagekit'

const imagekit = new ImageKit({ publicKey, urlEndpoint, authenticationEndpoint })


class Lib {
  upload(file, fileName, dir) {
    return new Promise((resolve, reject) => {
      imagekit.upload({ file, fileName, folder: `${folder}/${dir}` }, (err, result) => {
        if(err) reject(err)
        resolve(result.url)
      })
    })
  }
}

export default new Lib()
