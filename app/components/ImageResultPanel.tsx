import React from 'react';
import {RiQuillPenFill} from '@remixicon/react';

type TextResultPanelProps = {
  imageSource: string;
  errorText: string | React.ReactNode;
  warningText: string | React.ReactNode;
  showError: boolean;
  showWarning: boolean;
  loading: boolean;
};

export default function TextResultPanel({
  imageSource,
  errorText,
  warningText,
  showError,
  showWarning,
  loading,
}: TextResultPanelProps) {
  return (
    <div className="col-span-8 lg:col-span-8 2xl:col-span-3 bg-zinc-900 rounded-lg p-6">
      <div className="flex items-start h-[calc(100dvh-8rem)] lg:h-full">
        <div
          className="text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
          <RiQuillPenFill/>
        </div>
        <div className="ml-4 flex-1 h-full">
          {loading && (
            <div className="flex h-[24px] gap-1 items-center">
              <div className="w-2 h-2 rounded-full animate-pulse bg-blue-800"></div>
              <div className="w-2 h-2 rounded-full animate-pulse bg-blue-800"></div>
              <div className="w-2 h-2 rounded-full animate-pulse bg-blue-800"></div>
            </div>
          )}
          {showError && (
            <div className="flex bg-red-800 items-center justify-center w-full h-fit p-2 rounded-xl">
              {errorText}
            </div>
          )}
          {showWarning && (
            <div className="flex bg-orange-800 items-center justify-center w-full h-fit p-2 rounded-xl">
              {warningText}
            </div>
          )}
          {!loading && !showError && !showWarning && (
            <div className="p-3 rounded-lg bg-zinc-800">
              <img src={imageSource}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}