import React, {PropsWithChildren} from 'react';

export default function ConfigPanel({ children }: PropsWithChildren) {
  return (
    <div className="col-span-8 lg:col-span-3 2xl:col-span-2 bg-zinc-900 rounded-lg p-6">
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}