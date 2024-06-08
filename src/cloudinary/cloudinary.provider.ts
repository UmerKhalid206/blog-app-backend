import { v2 } from 'cloudinary';
export const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'dic1zeqfu',
      api_key: '697674826812618',
      api_secret: 'J0x8N7NCq35pSS9tZ-jH07F0lFI',
    });
  },
};


export const uploadToCloudinary = async(buffer: Express.Multer.File) => {
  console.log('prov', buffer)
  // return
  try {
    const image =  new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        { resource_type: "auto", api_key: '697674826812618', api_secret: 'J0x8N7NCq35pSS9tZ-jH07F0lFI', cloud_name: 'dic1zeqfu'},
        (error, result) => {
          if (error) {
            console.log(error);
            reject(new Error('Failed to upload file to Cloudinary'));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });
    console.log('in cloud', image)
    await image
    .then(image => {
      console.log('while sending from in cloud', image)
      return image
    })

  } catch (error) {
    console.log('error inside uploadation' + error);
  }
}


// import { v2 } from 'cloudinary';
// import { Provider } from '@nestjs/common';

// export const CLOUDINARY = 'Cloudinary';

// export const CloudinaryProvider: Provider = {
//   provide: CLOUDINARY,
//   useFactory: () => {
//     return v2.config({
//       cloud_name: 'dhyw8xinp',
//       api_key: '922764782338233',
//       api_secret: 'jOMB8GMO-N46oABlROtmky55W9E',
//     });
//   },
// };