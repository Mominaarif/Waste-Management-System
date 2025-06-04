// // src/WasteClassifier.tsx
// import React, { useState } from 'react';

// const WasteClassifier = () => {
//     const [url, setUrl] = useState('');
//     const [url1, setUrl1] = useState('');
//     const [results, setResults] = useState<any[]>([]);

//     const handleClassify = async () => {
//         const res = await fetch('http://localhost:5000/api/classify-image', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ url })
//         });

//         const data = await res.json();

//         setResults(data.objects || []);
//         setUrl1(data.flicker_url || '');
//     };

//     return (
//         <div style={{ padding: '1rem' }} className='flex flex-col items-center justify-center w-full'>
//             <h2 className='w-full text-left text-2xl pt-2'>Waste Classifier</h2>
//             <div className='flex items-center justify-center w-full pt-5 gap-5'>
//                 <input
//                     type="text"
//                     placeholder="Enter image URL"
//                     value={url}
//                     onChange={(e) => setUrl(e.target.value)}
//                     className="block w-1/2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"

//                 />
//                 <button className=' bg-[#386641] cursor-pointer text-white px-8 py-1.5 rounded-md shadow-md hover:bg-[#386641]/90' onClick={handleClassify}>Classify</button>
//             </div>
//             <ul>
//                 {results.map((item, idx) => (
//                     <li key={idx}>
//                         {item.label} ({Math.round(item.confidence * 100)}%)
//                     </li>
//                 ))}
//             </ul>
//             {url1 && <img src={url1} alt="" className='w-60 h-60' />}
//         </div>
//     );
// };

// // export default WasteClassifier;



// const App1 = () => {
//     return (
//         <div className="w-full bg-white">
//             <div className="border-b border-gray-200">
//                 <div className="flex items-center py-5">
//                     <h1 className='text-lg md:text-[26px] pl-5 md:pl-5 bg-white flex items-center'>Solid Waste Detection App</h1>
//                 </div>
//             </div>
//             <WasteClassifier />
//         </div>
//     );
// };

// export default App1;




import React, { useState } from 'react';
import { CloudUpload } from 'lucide-react';

interface MergedData {
    image_id: number;
    image_url: string;
    flicker_url: string;
    category: string;
}

const App1: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<MergedData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageLoadStatus, setImageLoadStatus] = useState<{ [key: number]: boolean }>({});
    const [uploadedFileName, setUploadedFileName] = useState<string>("");


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setResults([]);
            setError(null);
            setImageLoadStatus({});

            setUploadedFileName(e.target.files[0].name); // Store the uploaded file name
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        console.log(file.name);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/classify-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Upload failed');
            }

            const data: MergedData[] = await response.json();
            setResults(data);
            // Initially mark all images as not loaded
            const initialStatus = data.reduce((acc, item) => {
                acc[item.image_id] = false;
                return acc;
            }, {} as { [key: number]: boolean });
            setImageLoadStatus(initialStatus);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageLoad = (id: number) => {
        setImageLoadStatus((prev) => ({
            ...prev,
            [id]: true,
        }));
    };


    return (
        <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white px-5 md:px-8">
            <h2 className="w-full text-left text-2xl pt-2">Waste Classifier</h2>

            <div className="flex flex-col items-center justify-center w-full pt-5 gap-5">
                <div className="bg-white shadow-md rounded-lg p-6 w-1/2 flex justify-center items-center flex-col space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center w-full">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            id="file-upload"
                            name="file-upload"
                            accept=".json"
                            className="hidden"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                        >
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="text-sm text-gray-600">
                                    {uploadedFileName
                                        ? `${uploadedFileName} file selected`
                                        : 'Drag and drop images here, or click to select'}
                                </span>
                            </div>
                        </label>
                    </div>
                    {/* <div className="mt-2 w-4/5 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                        <CloudUpload className="mx-auto size-12 text-gray-300" />
                        <div className="mt-4 flex text-sm/6 text-gray-600">
                            <label htmlFor="file-upload" className="relative w-full flex flex-col items-center justify-center text-center cursor-pointer rounded-md bg-white font-semibold">
                                <span>Upload a file</span>
                                <input
                                    type="file"
                                    id="file-upload"
                                    name="file-upload"
                                    accept=".json"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                />
                                {uploadedFileName && <span className="ml-2 text-gray-500 font-medium">({uploadedFileName})</span>}
                            </label>
                        </div>
                    </div>
                </div> */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="bg-[#386641] cursor-pointer text-white px-8 py-1.5 rounded-md shadow-md hover:bg-[#386641]/90"
                    >
                        {loading ? "Uploading..." : "Upload & Classify"}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-600 mt-4">{error}</p>}

            {results.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Classification Results</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((item) => (
                            <li key={item.image_id} className="border p-4 rounded shadow flex flex-col gap-2 items-center">
                                <p><strong>Category:</strong> {item.category}</p>
                                {!imageLoadStatus[item.image_id] && (
                                    <p className="h-full w-full flex items-center justify-center">
                                        <span className="loading loading-infinity loading-xl"></span>
                                    </p>
                                )}
                                <img
                                    src={item.flicker_url}
                                    alt={item.category}
                                    className={`h-40 object-cover transition-opacity duration-300 ${imageLoadStatus[item.image_id] ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => handleImageLoad(item.image_id)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App1;


// interface PredictionResult {
//     filename: string;
//     predicted_class: string;
//     confidence: number;
//     all_probabilities?: number[];
// }

// interface BatchPredictionResponse {
//     message: string;
//     results: PredictionResult[];
//     csv_path: string;
// }






// import { useState } from 'react';

// interface FileUploadProps {
//   onResults: (results: PredictionResult[]) => void;
// }

// const FileUpload = ({ onResults }: FileUploadProps) => {
// //   const [files, setFiles] = useState<FileList | null>(null);
// //   const [isPredicting, setIsPredicting] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

//   // ... (keep all the existing code the same until the API calls)

// //   const handleSingleUpload = async () => {
// //     // ... (previous code)
// //       const result: PredictionResult = await response.json();
// //       onResults([result]); // Update this line
// //     // ... (rest of the code)
// //   };

// //   const handleBatchUpload = async () => {
// //     // ... (previous code)
// //       const data: BatchPredictionResponse = await response.json();
// //       onResults(data.results); // Update this line
// //     // ... (rest of the code)
// //   };
//     const [files, setFiles] = useState<FileList | null>(null);
//     const [isPredicting, setIsPredicting] = useState(false);
//     const [results, setResults] = useState<PredictionResult[]>([]);
//     const [error, setError] = useState<string | null>(null);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setFiles(e.target.files);
//         }
//     };

//     const handleSingleUpload = async () => {
//         if (!files || files.length === 0) return;

//         setIsPredicting(true);
//         setError(null);

//         const formData = new FormData();
//         formData.append('file', files[0]);

//         try {
//             const response = await fetch('http://localhost:5000/classify-image', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error(await response.text());
//             }

//           const result: PredictionResult = await response.json();
//       onResults([result]);

//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'An unknown error occurred');
//         } finally {
//             setIsPredicting(false);
//         }
//     };

//     const handleBatchUpload = async () => {
//         if (!files || files.length === 0) return;

//         setIsPredicting(true);
//         setError(null);

//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) {
//             formData.append('files', files[i]);
//         }

//         try {
//             const response = await fetch('http://localhost:5000/classify-image', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error(await response.text());
//             }

//                const data: BatchPredictionResponse = await response.json();
//       onResults(data.results);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'An unknown error occurred');
//         } finally {
//             setIsPredicting(false);
//         }
//     };

//     const downloadCSV = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/download_predictions');
//             if (!response.ok) {
//                 throw new Error('Failed to download predictions');
//             }
//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = 'predictions.csv';
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to download');
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                 <input
//                     type="file"
//                     multiple
//                     onChange={handleFileChange}
//                     accept="image/*"
//                     className="hidden"
//                     id="file-upload"
//                 />
//                 <label
//                     htmlFor="file-upload"
//                     className="cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
//                 >
//                     <div className="flex flex-col items-center justify-center space-y-2">
//                         <svg
//                             className="mx-auto h-12 w-12 text-gray-400"
//                             stroke="currentColor"
//                             fill="none"
//                             viewBox="0 0 48 48"
//                             aria-hidden="true"
//                         >
//                             <path
//                                 d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                                 strokeWidth={2}
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             />
//                         </svg>
//                         <span className="text-sm text-gray-600">
//                             {files && files.length > 0
//                                 ? `${files.length} file(s) selected`
//                                 : 'Drag and drop images here, or click to select'}
//                         </span>
//                     </div>
//                 </label>
//             </div>

//             <div className="flex space-x-4">
//                 <button
//                     onClick={handleSingleUpload}
//                     disabled={!files || isPredicting}
//                     className={`px-4 py-2 rounded-md text-white ${!files || isPredicting
//                         ? 'bg-gray-400 cursor-not-allowed'
//                         : 'bg-indigo-600 hover:bg-indigo-700'
//                         }`}
//                 >
//                     {isPredicting ? 'Predicting...' : 'Predict Single Image'}
//                 </button>

//                 {/* <button
//                     onClick={handleBatchUpload}
//                     disabled={!files || isPredicting}
//                     className={`px-4 py-2 rounded-md text-white ${!files || isPredicting
//                         ? 'bg-gray-400 cursor-not-allowed'
//                         : 'bg-indigo-600 hover:bg-indigo-700'
//                         }`}
//                 >
//                     {isPredicting ? 'Predicting...' : 'Predict Batch'}
//                 </button> */}

//                 {results.length > 0 && (
//                     <button
//                         onClick={downloadCSV}
//                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                     >
//                         Download CSV
//                     </button>
//                 )}
//             </div>

//             {error && (
//                 <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//                     {error}
//                 </div>
//             )}
//         </div>
//     );
// };

// // export default FileUpload;




// const ResultCard = ({ result }: { result: PredictionResult }) => {
//     return (
//         <div className="bg-white shadow rounded-lg p-4">
//             <div className="flex justify-between items-start">
//                 <div>
//                     <h3 className="text-lg font-medium text-gray-900">{result.filename}</h3>
//                     <p className="mt-1 text-sm text-gray-600">
//                         Predicted: <span className="font-semibold">{result.predicted_class}</span>
//                     </p>
//                     <p className="text-sm text-gray-600">
//                         Confidence: <span className="font-semibold">{(result.confidence * 100).toFixed(2)}%</span>
//                     </p>
//                 </div>
//                 <span
//                     className={`px-2 py-1 text-xs rounded-full ${result.confidence > 0.7 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                         }`}
//                 >
//                     {result.confidence > 0.7 ? 'High confidence' : 'Low confidence'}
//                 </span>
//             </div>
//         </div>
//     );
// };

// const PredictionsTable = ({ results }: { results: PredictionResult[] }) => {
//     if (results.length === 0) return null;

//     return (
//         <div className="mt-8">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Prediction Results</h2>
//             <div className="space-y-4">
//                 {results.map((result, index) => (
//                     <ResultCard key={index} result={result} />
//                 ))}
//             </div>
//         </div>
//     );
// };



// function App1() {
//     const [results, setResults] = useState<PredictionResult[]>([]);

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-3xl mx-auto">
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900">Litter Classification</h1>
//                     <p className="mt-2 text-sm text-gray-600">
//                         Upload images to classify different types of litter using AI
//                     </p>
//                 </div>

//                 <div className="bg-white shadow rounded-lg p-6">
//                    <FileUpload onResults={setResults} />
//           <PredictionsTable results={results} />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default App1;