import React, {PropsWithChildren} from 'react';

export default function PanelContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto lg:overflow-y-hidden">
      {children}
    </div>
  );
}