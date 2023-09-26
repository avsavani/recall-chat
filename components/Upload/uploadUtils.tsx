'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from "@/hooks/use-toast";
import { BsFileTextFill } from 'react-icons/bs'
import { BiError, BiPaste } from 'react-icons/bi'
import { useFileProgress } from "./utils";
import { AnimatePresence, motion } from "framer-motion"
import { Icons } from "@/components/icons"
import mixpanel from '@/lib/initMixpanel';
import { useSession } from 'next-auth/react';
import { useHandleUpload } from './useHandleUpload';

export function handleUpload() {
    const { uploadYoutube, uploadURL, uploadClipboard } = useHandleUpload();
    const { data: session } = useSession();

    const userId = session?.user?.id;
    function WebsiteLink({ handleCloseModal }: { handleCloseModal: () => void }) {
        const [inputURL, setInputURL] = useState<string>("");
        const [loading, setLoading] = useState(false);
        const [uploadComplete, setUploadComplete] = useState(false);


        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            inputRef.current?.focus();
        }, []);

        const handleChange = (e) => {
            setInputURL(e.target.value);
        };

        const isValidURL = (url) => {
            const urlRegExp: RegExp = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
            return urlRegExp.test(url);
        };
        const isValidYouTubeURL = (url) => {
            const youtubeRegExp: RegExp = /^((?:https?:)?\/\/)?(?:www\.)?(?:youtu\.be\/|youtube(?:\-nocookie)?\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]+)(?:\S+)?$/;
            return youtubeRegExp.test(url);
        };


        const handleSubmit = async () => {
            if (isValidURL(inputURL)) {
                mixpanel.track("Initiated Weblink Upload", { user_id: userId });
                setLoading(true);
                await uploadURL(inputURL, userId);
                setLoading(false);
                setUploadComplete(true);
                handleCloseModal();

                setTimeout(() => {
                    setUploadComplete(false);
                    handleCloseModal();
                }, 500);
            } else if (isValidYouTubeURL(inputURL)) {
                mixpanel.track("Invalid Weblink URL Attempted", { user_id: userId, attempted_url: inputURL });
                setLoading(true);
                await uploadYoutube(inputURL, userId)
                setLoading(false);
                setUploadComplete(true);
                handleCloseModal();

                setTimeout(() => {
                    setUploadComplete(false);
                    handleCloseModal();
                }, 500);
                toast({
                    title: "✅ Success!",
                    description: `Added file(s)`,
                });
            } else {
                alert("Please enter a valid web link!");
            }
        }

        const handleFormSubmit = (e) => {
            e.preventDefault();
            handleSubmit();
        };

        return (
            <form onSubmit={handleFormSubmit} className='flex flex-col transition-all'>
                <div className='flex flex-col transition-all'>
                    <label htmlFor="repo-url" className="text-base font-medium">Enter a website link</label>
                    <div className='flex relative'>
                        <input ref={inputRef} type="url" id="repo-url" name="repo-url" className="w-full mt-2 border rounded-lg py-2 px-3 text-base bg-gray-200 dark:bg-[#1c1a2b] dark:text-white focus:outline-none focus:ring-0 border-gray-700 focus:ring-gray-500 focus:ring-transparent" placeholder="typefrost.com/?..." required onChange={handleChange} />
                        <motion.button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={
                                'absolute right-2 text-white top-4 bg-violet-500 rounded-md px-2 py-1 text-[12px] font-medium'
                            }
                        >
                            <AnimatePresence>
                                {loading ? (
                                    <Icons.loading className="h-5 w-5 animate-spin text-white" />
                                ) : uploadComplete ? (
                                    <Icons.check className="h-5 w-5 text-white" />
                                ) : (
                                    <span>Upload</span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                    <div className=" mt-3 text-sm text-gray-500">Paste the full web link to the file you wish to upload</div>
                </div>
            </form>
        )
    }

    function YoutubeLink({ handleCloseModal }: { handleCloseModal: () => void }) {
        const [inputURL, setInputURL] = useState<string>("");
        const [loading, setLoading] = useState(false);
        const [uploadComplete, setUploadComplete] = useState(false);

        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            inputRef.current?.focus();
        }, []);

        const handleChange = (e) => {
            setInputURL(e.target.value);
        };

        const isValidYouTubeURL = (url) => {
            const youtubeRegExp: RegExp = /^((?:https?:)?\/\/)?(?:www\.)?(?:youtu\.be\/|youtube(?:\-nocookie)?\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]+)(?:\S+)?$/;
            return youtubeRegExp.test(url);
        };

        const handleSubmit = async () => {
            if (isValidYouTubeURL(inputURL)) {
                mixpanel.track("Initiated Youtube Upload", { user_id: userId });
                setLoading(true);
                await uploadYoutube(inputURL, userId);
                setLoading(false);

                setUploadComplete(true);

                // after 2 seconds, set uploadComplete back to false
                setTimeout(() => {
                    setUploadComplete(false);
                    handleCloseModal();
                }, 500);
                toast({
                    title: "✅ Success!",
                    description: `Added file(s)`,
                });
            } else {
                mixpanel.track("Invalid Youtube URL Attempted", { user_id: userId, attempted_url: inputURL });
                alert("Please enter a valid YouTube URL")
            }
        }

        const handleFormSubmit = (e) => {
            e.preventDefault();
            handleSubmit();
        };
        return (
            <form onSubmit={handleFormSubmit} className='flex flex-col transition-all'>
                <div className='flex flex-col transition-all'>
                    <label htmlFor="repo-url" className="text-base font-medium">Enter a public youtube URL:</label>
                    <div className='flex relative'>
                        <input ref={inputRef} type="url" id="repo-url" name="repo-url" className="w-full mt-2 border rounded-lg py-2 px-3 text-base bg-gray-200 dark:bg-[#1c1a2b] dark:text-white focus:outline-none focus:ring-0 border-gray-700 focus:ring-gray-500 focus:ring-transparent" placeholder="youtube.com/watch?v=..." required onChange={handleChange} />
                        <motion.button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={
                                'absolute right-2 text-white top-4 bg-violet-500 rounded-md px-2 py-1 text-[12px] font-medium'
                            }
                        >
                            <AnimatePresence>
                                {loading ? (
                                    <Icons.loading className="h-5 w-5 animate-spin text-white" />
                                ) : uploadComplete ? (
                                    <Icons.check className="h-5 w-5 text-white" />
                                ) : (
                                    <span>Upload</span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                    <div className=" mt-3 text-sm text-gray-500">Paste the full link to the Youtube video you wish to upload</div>
                </div>
            </form>
        )
    }

    function PasteLink({ handleCloseModal }: { handleCloseModal: () => void }) {
        const [inputText, setInputText] = useState<string>("");
        const [loading, setLoading] = useState(false);
        const [uploadComplete, setUploadComplete] = useState(false);

        const inputRef = useRef<HTMLTextAreaElement>(null);

        useEffect(() => {
            inputRef.current?.focus();
        }, []);


        const handleChange = (e) => {
            setInputText(e.target.value);
        };

        const handleSubmit = async () => {
            setLoading(true)

            await uploadClipboard(inputText, userId);
            setLoading(false)

            setUploadComplete(true);
            // after 2 seconds, set uploadComplete back to false
            setTimeout(() => {
                setUploadComplete(false);
                handleCloseModal();
            }, 500);
            toast({
                title: "✅ Success!",
                description: `Added file(s)`,
            });
        };

        return (
            <div className='flex flex-col transition-all'>
                <label htmlFor="repo-url" className="text-base font-medium">Paste anything here</label>
                <div className='flex relative'>
                    <textarea ref={inputRef} id="repo-url" name="repo-url" className="w-full mt-2 border rounded-lg py-2 px-3 text-base bg-gray-200 dark:bg-[#1c1a2b] dark:text-white focus:outline-none focus:ring-0 border-gray-700 focus:ring-gray-500 focus:ring-transparent" placeholder="empty clipboard here!" required onChange={handleChange} />
                    <motion.button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={
                            'absolute right-2 text-white top-4 bg-violet-500 rounded-md px-2 py-1 text-[12px] font-medium'
                        }
                    >
                        <AnimatePresence>
                            {loading ? (
                                <Icons.loading className="h-5 w-5 animate-spin text-white" />
                            ) : uploadComplete ? (
                                <Icons.check className="h-5 w-5 text-white" />
                            ) : (
                                <span>Upload</span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
                <div className=" mt-3 text-sm text-gray-500">Paste the full link to the Youtube video you wish to upload</div>
            </div>
        )
    }

    //write file upload logic here
    function FileUpload({ handleCloseModal }: { handleCloseModal: () => void }) {
        const { fileProgress, simulateFileProgress, updateFileProgress } = useFileProgress();

        const [showProgress, setShowProgress] = useState<boolean>(false)
        const [maxFileSize] = React.useState<number>(20971520); // 20 MB
        const [fileSize, setFileSize] = useState<number>(0)
        const [loadPercentage, setLoadPercentage] = useState<number>(0)
        const [uploadComplete, setUploadComplete] = useState(false);

        const [hasError, setError] = useState(false);

        const onDrop = useCallback((acceptedFiles: File[]) => {
            setUploadComplete(false);
            acceptedFiles.forEach(async (file: File) => {
                const reader = new FileReader();
                simulateFileProgress(file.name);

                reader.onload = async () => {
                    setShowProgress(true);
                    const binaryStr = reader.result;
                    setFileSize(file.size);

                    const formData = new FormData();
                    formData.append("files", file);
                    formData.append("user_id", userId);

                    try {
                        const response = await fetch("/api/deepgram", {
                            method: "post",
                            body: formData,
                        });

                        if (response.ok) {
                            updateFileProgress(file.name, 100);
                            setTimeout(() => {
                                setUploadComplete(false);
                                handleCloseModal();
                            }, 500);
                            toast({
                                title: "✅ Success!",
                                description: `Added file(s)`,
                            });
                        } else {
                            const errorData = await response.json();
                            toast({
                                title: "  🤐 Error!",
                                description: `${errorData.message}`,
                            });
                            setError(true);
                        }
                    } catch (error) {
                        console.error('Error uploading the file:', error);
                        setError(true);
                    }
                };

                reader.onerror = () => console.log('file reading has failed');
                reader.readAsArrayBuffer(file);
            });
        }, [userId]);


        const { getRootProps, getInputProps, isDragReject, isDragAccept, acceptedFiles, fileRejections } = useDropzone({
            onDrop,
            accept: {
                'audio/*': ['.mp3', '.wav', '.ogg'],
                'video/*': ['.mp4', '.mov', '.avi', '.mkv']
            },
            maxSize: maxFileSize,
        });


        //File list section. Dragging mutilpe files
        function fileAcceptance() {
            const allFiles = [...acceptedFiles];
            return allFiles.map((file, index) => {
                const isError = hasError && (fileProgress[file.name] || 0) === 0;
                return (
                    <div key={index}>
                        <div className={`flex w-full p-2 mt-2 border-2 border-gray-200 rounded-lg ${isError ? "bg-red-50" : ""}`}>
                            {isError ? (
                                <BiError className={`p-1 ${isError ? "text-red-400" : "text-gray-400"} border border-gray-200 rounded-md`} size={28} />
                            ) : (
                                <BsFileTextFill className={`p-1 text-gray-400 border border-gray-200 rounded-md`} size={28} />
                            )}
                            <div className="flex flex-col w-full gap-1 ml-4">
                                <p className={`text-[12px] text-bold ${isError ? "text-red-500" : "text-gray-600"}`}>{file.name}</p>
                                <div className="flex justify-between w-full">
                                    <div className="w-[92%] h-2 bg-gray-200 rounded-full">
                                        <div
                                            className={`relative h-2 transition-all duration-500 ease-out rounded-full ${isError ? "bg-red-500" : "bg-violet-500"}`}
                                            style={{ width: `${fileProgress[file.name] || 0}%` }}
                                        />
                                    </div>
                                    <div className="w-[5%] -mt-1 mr-1">
                                        <p className="text-[10px] text-gray-500">{fileProgress[file.name] || 0}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });

        };
        //handle error/rejection
        function fileRejection() {
            return fileRejections.map(({ file, errors }, index) => (
                <div key={index}>
                    {showProgress ? <div className='flex w-full p-2 mt-2 border-2 border-gray-200 rounded-lg'>
                        <BiError className='p-1 text-red-400 border border-gray-200 rounded-md' size={28} />
                        <div className='flex flex-col w-full gap-1 ml-4'>
                            {errors.map(e => (
                                <p key={e.code} className='text-[12px] text-bold text-red-500'>
                                    {file.name} ~ {e.message} </p>
                            ))}
                            <div className='flex justify-between w-full'>
                                <div className="w-[92%] h-2 bg-gray-200 rounded-full">
                                    <div className="relative w-0 h-2 transition-all duration-500 ease-out rounded-full bg-red-500" style={{ width: `${loadPercentage}%` }} />
                                </div>
                                <div className='w-[5%] -mt-1 mr-1'>
                                    <p className='text-[10px] text-gray-500'>{0}%</p>
                                </div>
                            </div>
                        </div>
                    </div> : null
                    }
                </div>
            ));
        }
        return (
            <>
                <div className={`p-8 mt-5 border-2 border-dashed rounded-lg ${isDragAccept ? 'border-violet-500 bg-violet-500 dark:bg-violet-950' : isDragReject ? 'border-red-500 bg-red-50' : ''}`} {...getRootProps()}>
                    <div className='flex mx-auto justify-center items-center mb-6 bg-gray-300 rounded-full w-[70px] h-[70px]'>
                        <BsFileTextFill size={48} />
                    </div>
                    <input {...getInputProps()} />
                    <p className='text-[20px] font-medium text-center text-gray-600'>{isDragAccept ? "Drop file(s) here" : isDragReject ? "File type not allowed" : fileSize > maxFileSize ? isDragReject : "Drag file(s) here"}</p>
                    <p className='text-center text-s text-gray-400'>
                        or, click to browse (20 MB max)
                    </p>

                </div>
                {fileAcceptance()}
                {fileRejection()}

            </>
        )
    }

    return { WebsiteLink, FileUpload, PasteLink, YoutubeLink }
}
