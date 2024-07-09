import { FileUploader } from "./FileUploader";
import { FileList } from "./FileList";
import { S3Client } from "@aws-sdk/client-s3";

export const FileCapture = ({
  apiEndpoint,
  bucketName,
  userId,
  s3Client,
}: {
  apiEndpoint: string;
  bucketName: string;
  userId: string;
  s3Client: S3Client;
}) => {
  return (
    <div className="my-8">
      <FileUploader
        s3Client={s3Client}
        apiEndpoint={apiEndpoint}
        bucketName={bucketName}
        userId={userId}
      />
      <FileList apiEndpoint={apiEndpoint} userId={userId} />
    </div>
  );
};
