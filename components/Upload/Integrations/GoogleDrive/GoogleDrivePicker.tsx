import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import useDrivePicker from "./DrivePicker"
import { useSession } from 'next-auth/react'
import { toast } from "@/hooks/use-toast";


interface GoogleDrivePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onPickerClosed?: () => void;
  onFilesPicked?: (files: any[], fromGoogleDrive?: boolean) => void; // Modify this line
}

type GoogleDrivePickerRef = {
  handleOpenPicker: () => void;
};

const GoogleDrivePicker = forwardRef<GoogleDrivePickerRef, GoogleDrivePickerProps>(
  ({ isOpen, ...props }, ref) => {
    const [openPicker, authResponse] = useDrivePicker();

    console.log(authResponse?.access_token)
    const { data: session } = useSession()
    const user = session?.user;
    const userId = user?.id;

    const onFilesPicked = useCallback(async (data: any) => {
      if (data.action === 'picked') {
        console.log("These are the files picked",)
        const files = data.docs;
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("accessToken", authResponse?.access_token);
        files.forEach(file => {
          formData.append("fileIds", file.id);
          formData.append("fileNames", file.name);
        });

        const backendResponse = await fetch(`https://api.typefrost.com/drive`, {
          method: 'POST',
          body: formData,
        });

        if (!backendResponse.ok) {
          console.log(`Error sending file information to the backend:`, backendResponse.status);
        } else {
          const { message, success } = await backendResponse.json();

          if (success) {
            toast({
              title: "✅ Success!",
              description: `Uploaded files`,
            });
          } else {
            toast({
              title: "❌ Error!",
              description: `${message}`,
            });
          }
        }

        if (props.onPickerClosed) {
          props.onPickerClosed();
        }

        // Add this block to ensure you have a valid files array before calling the prop function
        if (data.action === 'picked') {
          console.log("Console log : ", props.onFilesPicked(files))
          props.onFilesPicked(files, true);
        }
      }
    }, [authResponse, userId, props.onFilesPicked]);



    useImperativeHandle(ref, () => ({
      handleOpenPicker: () => {
        openPicker({
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          token: authResponse?.access_token,
          viewMimeTypes: "application/vnd.google-apps.document,application/pdf",
          showUploadView: false,
          showUploadFolders: false,
          supportDrives: true,
          multiselect: true,
          callbackFunction: onFilesPicked,
          customScopes: ['https://www.googleapis.com/auth/drive.file']
        });
      },
    }));

    return <div style={{ display: 'none' }} />;
  }
);

GoogleDrivePicker.displayName = 'GoogleDrivePicker';

export default GoogleDrivePicker;
