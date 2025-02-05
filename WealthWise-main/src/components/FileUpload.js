import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, FileText, X } from 'lucide-react';
import Navbar from './navbar';

const FileUpload = ({mail}) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === "text/csv") {
                setFile(selectedFile);
                toast.success("CSV file selected successfully!");
            } else {
                setFile(null);
                toast.error("Please upload a valid CSV file.");
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            toast.warning("Please select a CSV file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);

        try {
            const getCookie = Cookies.get('sessionToken');
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "upload", formData, {
                headers: {
                    Authorization: `Bearer ${getCookie}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            
            toast.success(response.data.message || "File uploaded successfully!");
            setFile(null);
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error(error.response?.data?.message || "Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
    };

    return (
        <> 
            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar={false} 
                newestOnTop={false}
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
            />
            <Navbar mail={mail}/>
            <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900/70 to-purple-900/70 p-4">
                <div className="w-full max-w-md bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                    <h2 className="text-3xl font-bold mb-6 text-white text-center">Upload CSV File</h2>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="relative border-2 border-dashed border-white/40 rounded-xl p-6 text-center hover:border-white/60 transition-all duration-300 bg-white/10">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <FileText className="w-12 h-12 text-white/80" />
                                <p className="text-white/90 font-medium">
                                    {file 
                                        ? `Selected: ${file.name}` 
                                        : "Drag and drop a CSV file or click to select"}
                                </p>
                            </div>
                            {file && (
                                <button 
                                    type="button" 
                                    onClick={clearFile} 
                                    className="absolute top-2 right-2 text-white/70 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={!file || uploading}
                            className={`
                                w-full mt-4 py-3 rounded-lg transition-all duration-300
                                ${!file 
                                    ? 'bg-white/20 text-white/50 cursor-not-allowed' 
                                    : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'}
                                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {uploading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Upload className="w-5 h-5 mr-2" />
                                    Upload
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FileUpload;
