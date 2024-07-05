'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {RiHomeFill, RiChat1Fill, RiLandscapeFill} from '@remixicon/react'

function SideBarItem({
                       href,
                       model,
                       company,
                       children,
                     }: Readonly<{
  href: string;
  model: string;
  company: string;
  children: React.ReactNode;
}>) {
  return (
    <Link
      href={href}
      className="flex group relative overflow-hidden items-center mt-6 gap-5 rounded-md shadow-lg outline-none transition duration-300 hover:bg-zinc-500/10 focus:bg-zinc-500/50"
    >
      <div className="h-12 w-12 flex-none">
        {children}
      </div>
      <div className="flex flex-auto flex-col truncate">
        <div className="font-semibold w-full flex-none truncate">
          {model}
        </div>
        <div className="text-gray-400 text-sm truncate flex-1">
          {company}
        </div>
      </div>
    </Link>
  );
}

export default function SideBar() {
  return (
    <div className="flex flex-col flex-1 gap-2">
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg px-6 py-6">
        <ul>
          <li>
            <Link href="/" className="flex gap-4 items-center">
              <RiHomeFill/>
              AI Playground
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex flex-col bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg px-6 py-6 gap-6 flex-1">
        <ul>
          <li>
            <a className="flex gap-4 items-center">
              <RiChat1Fill/>
              聊天对话
            </a>
          </li>
          <li>
            <SideBarItem href="/chat/gpt" model="GPT" company="OpenAI">
              <Image
                className="object-cover rounded h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
                src="/GPT-4.png"
                alt="GPT-4"
                width={1024}
                height={1024}
              />
            </SideBarItem>
          </li>
          <li>
            <SideBarItem href="/chat/claude" model="Claude" company="Anthropic">
              <Image
                className="object-cover rounded h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
                src="/Claude-3.webp"
                alt="Claude-3"
                width={2880}
                height={1620}
              />
            </SideBarItem>
          </li>
          <li>
            <SideBarItem href="/chat/gemini" model="Gemini" company="Google">
              <Image
                className="object-cover rounded h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
                src="/Gemini_Pro.png"
                alt="Gemini Pro"
                width={512}
                height={512}
              />
            </SideBarItem>
          </li>
          <li>
            <SideBarItem href="/chat/ernie" model="文心一言" company="百度">
              <Image
                className="object-cover rounded h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
                src="/ERNIE.png"
                alt="文心一言"
                width={3000}
                height={3000}
              />
            </SideBarItem>
          </li>
          <li>
            <SideBarItem href="/chat/qwen" model="通义千问" company="阿里巴巴">
              <Image
                className="object-cover rounded h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
                src="/Qwen.png"
                alt="通义千问"
                width={420}
                height={420}
              />
            </SideBarItem>
          </li>
        </ul>

        <hr className="border-2 border-zinc-500/50 my-2"/>

        <ul>
          <li>
            <a className="flex gap-4 items-center">
              <RiLandscapeFill/>
              图片生成
            </a>
          </li>
          <li>
            <SideBarItem href="/paint/dall-e" model="DALL·E" company="OpenAI">
              <Image
                className="object-cover rounded h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
                src="/DALL-E_3.jpg"
                alt="DALL·E 3"
                width={512}
                height={512}
              />
            </SideBarItem>
          </li>
          <li>
            <SideBarItem href="/paint/stable-diffusion" model="Stable Diffusion" company="Stability AI">
              <Image
                className="object-cover rounded h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
                src="/Stable_Diffusion.png"
                alt="Stable Diffusion"
                width={512}
                height={512}
              />
            </SideBarItem>
          </li>
        </ul>
      </div>
    </div>
  );
}