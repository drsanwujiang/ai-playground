import React, {PropsWithChildren} from 'react';

export default function PanelContent({ children }: PropsWithChildren) {
  return (
    <div className="flex-1 grid grid-cols-8 items-stretch gap-4 rounded-lg lg:overflow-y-auto">
      {children}
    </div>
  );
}