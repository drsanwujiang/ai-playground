import React from 'react';

export default function Header({
                                 className,
                                 image,
                                 title,
                                 description,
                               }: Readonly<{
  className?: string;
  image: React.ReactNode;
  title: string;
  description: string;
}>) {
  return (
    <div
      className={`flex flex-col items-center lg:flex-row lg:items-stretch gap-8 p-6 lg:p-0 lg:pr-6 bg-zinc-900 ${className}`}>
      <div className="h-40 w-40 flex-none">
        {image}
      </div>
      <div className="flex flex-col items-center lg:items-start my-auto gap-4">
                <span className="font-bold text-6xl text-center lg:text-start">
                    {title}
                </span>
        <span className="text-lg text-center lg:text-start">
                    {description}
                </span>
      </div>
    </div>
  );
}