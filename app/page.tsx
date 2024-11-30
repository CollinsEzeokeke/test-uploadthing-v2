"use client"

import { generateReactHelpers } from "@uploadthing/react/hooks"
import type { OurFileRouter } from "./api/uploadthing/core"
import { ChangeEvent, useState } from "react";
import Image from "next/image";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();


export default function Home() {

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log('Upload completed', res);
    },
    onUploadError: (error) => {
      console.error('Upload error', error);
    }
  })
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
      setFile(file)
    }
  }
  // const fileData = handleChange(event)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
     if (!file) {
      console.log('No file selected yet');
      return;
    }
    try {
      const resultUpload = await startUpload([file])
      
      if (resultUpload && resultUpload[0]) {
        console.log('File URL:', resultUpload[0].fileUrl);
      }
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen">{
          image && (
            <div className="h-[10vh] w-[20vw]">
              <Image
                src={image}
                alt="this is a preview"
                height={100}
                width={200} />
            </div>
          )
        }
      <div >
        <input type="file" accept="image/*" className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100" onChange={handleChange} />
        
        <button onClick={handleSubmit}>uploadImage</button>
      </div>
    </div>
  )
}