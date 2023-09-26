'use client'
import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { AiFillYoutube, AiFillFileAdd, AiOutlineCloseCircle } from 'react-icons/ai'
import { BiPaste } from 'react-icons/bi'
import { useSession } from 'next-auth/react';
import { usePsychicLink } from '@psychic-api/link'
import { handleUpload } from "./uploadUtils"
import { CgWebsite } from 'react-icons/cg'
import { useStore } from "@/lib/globalState";
import { useHandleUpload } from './useHandleUpload'

interface MultiloadProps {
    handleCloseModal: () => void;
}


export default function Multiload({ handleCloseModal }: MultiloadProps) {
    const [selectedDataSource, setSelectedDataSource] = useState('fileUpload');
    const { psychicCallback } = useHandleUpload();
    const { open, isReady, isLoading, error } = usePsychicLink(process.env.NEXT_PUBLIC_PSYCHIC_API_KEY, psychicCallback)
    const { WebsiteLink, FileUpload, PasteLink, YoutubeLink } = handleUpload()
    const { data: session, status } = useSession();
    const userId = session?.user?.id;


    // const handleDataSourceSelect = useCallback((dataSource: string) => {
    //     setSelectedDataSource(dataSource);
    // }, []);

    return (
        <>

            <div className='w-full flex flex-col gap-3 min-h-56 rounded-md mt-8 px-4 bg-white dark:bg-gray-900 py-6 shadow-md border-2 border-gray-300 dark:border-gray-700 relative'>
                <AiOutlineCloseCircle className="absolute top-0 right-0 m-4 cursor-pointer text-gray-500 dark:text-gray-400" size={22} onClick={handleCloseModal} />

                {/* Conditional rendering based on selected data source */}
                {selectedDataSource === 'fileUpload' ? <FileUpload handleCloseModal={handleCloseModal} /> : selectedDataSource === 'webLink' ? <WebsiteLink handleCloseModal={handleCloseModal} /> :
                    selectedDataSource === 'youtubeLink' ? <YoutubeLink handleCloseModal={handleCloseModal} /> :
                        selectedDataSource === 'pasteItem' ? <PasteLink handleCloseModal={handleCloseModal} /> :
                            <p className="text-gray-700 dark:text-gray-200">Select a data source to add to your knowledge base</p>}

                <div className='grid md:grid-cols-2 grid-flow-dense gap-2'>

                    {/* <div className={'flex h-10 group bg-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600 rounded-md cursor-pointer items-center px-4 gap-2 shadow-md ' + (selectedDataSource === 'fileUpload' ? ' bg-blue-500 dark:bg-gray-600 ' : '')} onClick={() => handleDataSourceSelect('fileUpload')}>
                        <AiFillFileAdd size={22} className='group-hover:scale-90 text-gray-600 dark:text-gray-400' /><p>Upload Files</p>
                    </div> */}

                    {/* <div className={'flex h-10 group bg-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600 rounded-md cursor-pointer items-center px-4 gap-2 shadow-md ' + (selectedDataSource === 'webLink' ? ' bg-blue-500 dark:bg-gray-600  ' : '')} onClick={() => handleDataSourceSelect('webLink')}>
                        <CgWebsite size={22} className='group-hover:scale-90 text-gray-600 dark:text-gray-400' /><p>Website</p>
                    </div>

                    <div className={'flex h-10 group bg-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600 rounded-md cursor-pointer relative items-center px-4 gap-2 shadow-md ' + (selectedDataSource === 'youtubeLink' ? ' bg-blue-500 dark:bg-gray-600  ' : '')} onClick={() => handleDataSourceSelect('youtubeLink')}>
                        <AiFillYoutube size={22} className='group-hover:scale-90 text-gray-600 dark:text-gray-400' /><p>Youtube Video</p>
                    </div>

                    <div className={'flex h-10 group bg-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600 rounded-md cursor-pointer relative items-center px-4 gap-2 shadow-md ' + (selectedDataSource === 'pasteItem' ? ' bg-blue-500 dark:bg-gray-600  ' : '')} onClick={() => handleDataSourceSelect('pasteItem')}>
                        <BiPaste size={22} className='group-hover:scale-90 text-gray-600 dark:text-gray-400' /><p>Paste anything here</p>
                    </div> */}

                </div>

                <div onClick={() => {
                    open(userId)
                }} className='flex min-h-16 bg-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600 rounded-md cursor-pointer py-2 px-4'>
                    <Image src="/oauthicons.png" width="50" height="50" alt="oauthicons" className='object-cover' />
                    <span className='flex-col ml-6'>
                        <h1 className='font-bold capitalize text-gray-700 dark:text-gray-100'>Connect to your favorite Integrations</h1>
                        <p className='md:text-[15px] text-red-600 dark:text-red-600'>Note: It may take a couple minutes to process files from Integrations.</p>
                    </span>

                </div>

            </div>
        </>
    )
}