'use client';

import React from 'react';
import { usePathname } from 'next/navigation'
import { Inter } from 'next/font/google';
import SideBar from '@/app/components/sidebar';

import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    return (
        <html lang="zh-CN">
            <head>
                <title>AI Playground</title>
            </head>
            <body className={inter.className}>
                <div className="flex flex-col sm:flex-row h-screen p-2 gap-2 items-stretch">
                    {pathname !== '/auth' && (
                        <div className="flex flex-col lg:w-[350px]">
                            <SideBar/>
                        </div>
                    )}
                    <div className="w-full h-[calc(dvh-1rem)]] mx-auto rounded-lg bg-gradient-to-br from-zinc-800 to-stone-800 p-6">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}