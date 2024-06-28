import { VoiceUploader } from "./VoiceUploader";
import { VoiceList } from "./VoiceList";
import { S3Client } from "@aws-sdk/client-s3";

export const VoiceCapture = ({
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
      <VoiceUploader
        s3Client={s3Client}
        apiEndpoint={apiEndpoint}
        bucketName={bucketName}
        userId={userId}
      />
      <VoiceList apiEndpoint={apiEndpoint} userId={userId} />
    </div>
  );
};
