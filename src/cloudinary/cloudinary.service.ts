import { BadRequestException, Injectable } from '@nestjs/common';
import toStream from 'buffer-to-stream';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  
  async uploadImage(file: Express.Multer.File): Promise<any> {
    console.log('service', file);
    // return
    try {
    return new Promise((resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.log(error);
              reject(new Error('Failed to upload file to Cloudinary'));
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(file);
      });

      

    } catch (error) {
      console.error(error);
      // Handle error
      throw new BadRequestException('Invalid file type.');
    }
  }

  async deleteImage(imageUrl: string): Promise<any>{
//     console.log('from next', imageUrl)
// const match = imageUrl.match(/\/v(\d+)\/([^\/]+)\.png/);

function getImageIdFromCloudinaryUrl(url: string): string | null {
  const lastSlashIndex = url.lastIndexOf('/');
  const extensionStartIndex = url.lastIndexOf('.');
  
  if (lastSlashIndex !== -1 && extensionStartIndex !== -1 && extensionStartIndex > lastSlashIndex) {
      const imageId = url.substring(lastSlashIndex + 1, extensionStartIndex);
      return imageId;
  }

  return null;
}

const imageId = getImageIdFromCloudinaryUrl(imageUrl);

console.log('imageId', imageId)
if(imageId){
      const res = await v2.uploader.destroy(imageId)
      return res
}
// if (match) {
//     const imageId = match[2];
//   }
}

}