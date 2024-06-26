// import React, { useState } from 'react';
// import FileUploader from './FileUploader';
// import FileList from './FileList';
// import { S3Client } from '@aws-sdk/client-s3';

// type FileCaptureProps = {
//   s3Client: S3Client;
//   bucketName: string;
//   uploadPath?: string;
//   initialFiles?: string[];
//   fetchFiles: () => Promise<string[]>;
//   renderFile: (fileUrl: string, index: number) => React.ReactNode;
// };

// const FileCapture: React.FC<FileCaptureProps> = ({ s3Client, bucketName, uploadPath, initialFiles = [], fetchFiles, renderFile }) => {
//   const [files, setFiles] = useState<string[]>(initialFiles);
//   const [loading, setLoading] = useState(false);

//   const updateFiles = async () => {
//     setLoading(true);
//     const newFiles = await fetchFiles();
//     setFiles(newFiles);
//     setLoading(false);
//   };

//   const handleUploadSuccess = (fileKey: string) => {
//     setFiles([...files, `https://${bucketName}.s3.${s3Client.config.region}.amazonaws.com/${fileKey}`]);
//   };

//   return (
//     <div className="my-8">
//       <FileUploader s3Client={s3Client} bucketName={bucketName} uploadPath={uploadPath} onUploadSuccess={handleUploadSuccess} />
//       <FileList files={files} loading={loading} renderFile={renderFile} />
//     </div>
//   );
// };

// export default FileCapture;
