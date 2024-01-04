import ncp from 'ncp'

export const copy = (sourceFolder, targetFolder) => new Promise((res, rej) => {
    ncp(sourceFolder, targetFolder, function (err) {
        if (err) {
          return rej(err)
        }
        res(true)
      });
})