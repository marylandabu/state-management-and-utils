// import React, { useEffect, useState } from "react";
// import { authAxios, getUserData } from "state-management-and-utils";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// import config from "../config";
// import LoadingSpinner from "./LoadingSpinner";

// const VideoList = ({config}: any) => {
//   const data = getUserData();
//   const userId = data?.id;
//   const [videos, setVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

// const { BASE_URL, region, accessKeyId, secretAccessKey } = config;
//   const s3Client = new S3Client({
//     region,
//     credentials: {
//       accessKeyId,
//       secretAccessKey,
//     },
//   });

//   useEffect(() => {
//     if (!userId) return;

//     authAxios
//       .get(`${BASE_URL}/users/${userId}/video`)
//       .then((response) => {
//         const vids = response.data.videos;
//         setVideos(vids);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching videos:", error);
//         setLoading(false);
//       });
//   }, [userId]);

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="my-8">
//       <h2 className="text-2xl font-bold mb-4">My Videos</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {videos.length > 0 ? (
//           videos.map((videoUrl, index) => (
//             <div key={index} className="relative">
//               <video className="w-full h-auto" controls>
//                 <source src={videoUrl} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             </div>
//           ))
//         ) : (
//           <p>No videos found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const VideoUploader = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const data = getUserData();
//   const userId = data?.id;

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setSelectedFile(event.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     setLoading(true);

//     const fileName = `videos/${Date.now()}_${selectedFile.name}`;
//     const uploadParams = {
//       Bucket: "tho",
//       Key: fileName,
//       Body: selectedFile,
//       ACL: "public-read",
//     };

//     try {
//       //@ts-ignore
//       const command = new PutObjectCommand(uploadParams);
//       await s3Client.send(command);

//       console.log("Upload successful");
//       await authAxios.post(`${BASE_URL}/users/${userId || 1}/upload_video`, {
//         video: fileName,
//       });

//       alert("Video uploaded successfully");
//     } catch (error) {
//       console.error("Error uploading video:", error);
//       alert("Failed to upload video");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {loading && <LoadingSpinner />}
//       <input type="file" accept="video/*" onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={!selectedFile || loading}>
//         Upload Video
//       </button>
//     </div>
//   );
// };

// const VideoCapture = () => {
//   return (
//     <div className="my-8">
//       <VideoUploader />
//       <VideoList />
//     </div>
//   );
// };

// export default VideoCapture;
