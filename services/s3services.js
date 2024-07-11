const AWS = require('aws-sdk');
const uploadToS3 = (data, filename) => {
  const BUCKET_NAME = process.env.s3_BUCKET_NAME;
  const IAM_USER_KEY = process.env.s3_IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.s3_IAM_USER_SECRET;

  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, async (err, s3response) => {
      if (err) {
        console.log('something went wrong', err);
        reject(err);
      } else {
        try {
          // Generate a pre-signed URL valid for 15 minutes
          const urlParams = { Bucket: BUCKET_NAME, Key: filename, Expires: 900 }; // 15 minutes in seconds
          const downloadUrl = await s3bucket.getSignedUrlPromise('getObject', urlParams);
          console.log('success', s3response);
          resolve(downloadUrl);
        } catch (urlError) {
          console.log('Error generating pre-signed URL', urlError);
          reject(urlError);
        }
      }
    });
  });
}

module.exports = {
  uploadToS3
}