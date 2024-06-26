import { S3Client } from "@aws-sdk/client-s3";

export const createS3Client = ({
  region,
  accessKeyId,
  secretAccessKey,
}: {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}) => {
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};
