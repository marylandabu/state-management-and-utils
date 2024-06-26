import VideoUploader from "./VideoUploader";
import VideoList from "./VideoList";
import { S3Client } from "@aws-sdk/client-s3";

const VideoCapture = ({
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
      <VideoUploader
        s3Client={s3Client}
        apiEndpoint={apiEndpoint}
        bucketName={bucketName}
        userId={userId}
      />
      <VideoList apiEndpoint={apiEndpoint} userId={userId} />
    </div>
  );
};

export default VideoCapture;
