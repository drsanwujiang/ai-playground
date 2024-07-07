import React, {PropsWithChildren, useState} from 'react';
import {RiUserFill, RiSendPlaneFill, RiCloseFill} from '@remixicon/react';
import {useDropzone} from 'react-dropzone';

type PromptPanelProps = {
  promptPlaceholder: string;
  imageUploadTips?: string | React.ReactNode;
  buttonText: string | React.ReactNode;
  loading: boolean;
  onRequest: (prompt: string, image: File | undefined, imageData: string) => void;
  allowImage?: boolean;
};

export default function PromptPanel({
  promptPlaceholder,
  imageUploadTips,
  buttonText,
  loading,
  onRequest,
  allowImage,
  children,
}: PromptPanelProps & PropsWithChildren) {
  const [prompt, setPrompt] = useState("");
  const [currentImage, setCurrentImage] = useState<File | undefined>(undefined);
  const [currentImageData, setCurrentImageData] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    disabled: loading,
    multiple: false,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    onDrop: acceptedFiles => {
      if (acceptedFiles.length === 1) {
        setCurrentImage(acceptedFiles[0]);
        setCurrentImageData("");
        setLoadingImage(true);

        const reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onload = () => {
          setCurrentImageData(reader.result as string);
          setLoadingImage(false);
        };
      }
    }
  });

  const handleRequest = () => {
    const trimmedPrompt = prompt.trim();
    setPrompt(trimmedPrompt);

    if (trimmedPrompt.length === 0) {
      return;
    }

    onRequest(trimmedPrompt, currentImage, currentImageData);
  };

  return (
    <div className="col-span-8 lg:col-span-5 2xl:col-span-3 bg-zinc-900 rounded-lg p-6">
      <div className="flex items-start h-[calc(100dvh-8rem)] lg:h-full">
        <div
          className="text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
          <RiUserFill/>
        </div>
        <div className="ml-4 flex flex-col flex-1 h-full">
          <textarea
            className="w-full flex flex-1 p-4 bg-neutral-900 border rounded-lg resize-none focus-within:outline-none disabled:opacity-50 disabled:pointer-events-none"
            placeholder={promptPlaceholder}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={loading}
          />
          {allowImage && (
            <div>
              {!currentImage && (
                <div
                  className={"dropzone flex items-center justify-center w-full mt-6 cursor-pointer select-none transition duration-300 hover:bg-zinc-700" + (loading ? " opacity-50 pointer-events-none" : "")}
                  {...getRootProps()}
                >
                  <div
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg"
                    aria-disabled={loading}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isDragActive ? (
                        <>
                          <p className="text-md text-gray-500 dark:text-gray-400">
                            把它拖动到这里
                          </p>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">选择一张图片</span> 或者把图片拖动到这里
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {imageUploadTips}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <input {...getInputProps()} />
                </div>
              )}
              {loadingImage && (
                <div className="flex items-center justify-center w-full mt-6 select-none">
                  <div
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg">
                    <div
                      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                      role="status"
                    >
                    </div>
                    <div className="flex flex-col items-center justify-center mt-4">
                      正在加载……
                    </div>
                  </div>
                </div>
              )}
              {currentImage && currentImageData && (
                <div
                  className={"flex items-center justify-center w-full mt-6 select-none transition duration-300 hover:brightness-100" + (loading ? " opacity-50 pointer-events-none" : "")}>
                  <div
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="flex items-center justify-center">
                      <img className="object-contain h-32" src={currentImageData}/>
                    </div>
                    <div
                      className="fixed flex w-full h-40 items-center justify-center bg-gray-500/50 opacity-0 hover:opacity-100 transition duration-300 ease-in-out">
                      <button
                        type="button"
                        className="inline-block rounded-full bg-white p-2 uppercase leading-normal shadow-primary-3"
                        onClick={() => {
                          setCurrentImage(undefined);
                          setCurrentImageData("");
                        }}
                      >
                        <RiCloseFill className="fill-red-700"/>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {children}
          <button
            type="submit"
            className="flex items-center gap-2 justify-center w-full h-10 text-base rounded-md border border-gray-500 mt-6 transition duration-300 hover:bg-zinc-700 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRequest}
            disabled={loading}
          >
            <RiSendPlaneFill/>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}