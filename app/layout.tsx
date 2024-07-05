'use client';

import React, {PropsWithChildren, useContext, useRef} from 'react';
import {usePathname} from 'next/navigation'
import {Inter} from 'next/font/google';
import {LayoutRouterContext} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {AnimatePresence, motion} from 'framer-motion';
import SideBar from '@/app/components/sidebar';

import './globals.css';

const inter = Inter({subsets: ["latin"]});

const FrozenRouter = ({children}: PropsWithChildren) => {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
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
        <AnimatePresence mode="popLayout">
          <motion.div
            className="h-full"
            key={pathname}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5, type: "linear"}}
          >
            <FrozenRouter>
              {children}
            </FrozenRouter>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    </body>
    </html>
  );
}