'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RiUserFill, RiSendPlaneFill, RiQuillPenFill } from '@remixicon/react'
import Header from '@/app/components/header';
import Select, { SelectItem } from '@/app/components/select';
import Slider from '@/app/components/slider';

import { requestGemini } from '@/app/services';

export default function Page() {
    const models: SelectItem[] = [
        { content: "Gemini Pro", value: "gemini-pro" },
    ];
    const safetySettings: SelectItem[] = [
        { content: "未指定阈值", value: "HARM_BLOCK_THRESHOLD_UNSPECIFIED" },
        { content: "允许微不足道的此类内容", value: "BLOCK_LOW_AND_ABOVE" },
        { content: "允许少量的此类内容", value: "BLOCK_MEDIUM_AND_ABOVE" },
        { content: "允许中等数量的此类内容", value: "BLOCK_ONLY_HIGH" },
        { content: "允许所有此类内容", value: "BLOCK_NONE" },
    ];

    const [model, setModel] = useState(models[0]);
    const [temperature, setTemperature] = useState(0.9);
    const [topP, setTopP] = useState(1.0);
    const [safetyHateSpeech, setSafetyHateSpeech] = useState(safetySettings[0]);
    const [safetySexuallyExplicit, setSafetySexuallyExplicit] = useState(safetySettings[0]);
    const [safetyDangerousContent, setSafetyDangerousContent] = useState(safetySettings[0]);
    const [safetyHarassment, setSafetyHarassment] = useState(safetySettings[0]);

    const [prompt, setPrompt] = useState('');
    const [chat, setChat] = useState('');

    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [showChat, setShowChat] = useState(true);

    const handleRequest = () => {
        setPrompt(prompt.trim());

        if (prompt.length === 0) {
            return;
        }

        setLoading(true);
        setShowError(false);
        setShowWarning(false);
        setShowChat(false);

        requestGemini(model.value, {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature,
                topP,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: safetyHateSpeech,
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: safetySexuallyExplicit,
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: safetyDangerousContent,
                },
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: safetyHarassment,
                },
            ],
        })
            .catch(() => {
                setLoading(false);
                setShowError(true);

                return Promise.reject();
            })
            .then(response => {
                setLoading(false);

                if (response.status === 200) {
                    return response.json();
                } else {
                    setShowError(true);

                    return Promise.reject();
                }
            })
            .then(data => {
                if (data.code === 0) {
                    setChat(data.data.content);
                    setShowChat(true);
                } else {
                    setShowWarning(true);
                }
            });
    };

    return (
        <div className="flex flex-col h-full gap-4 overflow-y-auto lg:overflow-y-hidden">
            <Header
                image={
                    <Image
                        className="object-cover h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
                        src="/Gemini_Pro.png"
                        alt="Gemini Pro"
                        width={512}
                        height={512}
                    />
                }
                title="Gemini"
                description="Gemini 是由 Google 开发的生成式人工智能聊天机器人，它基于同名的 Gemini 系列大型语言模型"
            />

            <div className="flex-1 grid grid-cols-8 items-stretch gap-4 rounded-lg lg:overflow-y-auto">
                <div className="col-span-8 lg:col-span-3 2xl:col-span-2 bg-zinc-900 rounded-lg p-6">
                    <div className="flex flex-col">
                        <span className="text-xl">模型</span>
                        <div className="mt-6">
                            <Select
                                items={models}
                                value={model}
                                setValue={setModel}
                            />
                        </div>

                        <span className="text-xl mt-12">高级选项</span>
                        <div className="grid grid-cols-1 gap-6 mt-6">
                            <Slider
                                name="温度（Temperature）"
                                description="采样的随机性。较高的数值可以带来更具多样性或创造性的结果"
                                min={0}
                                max={1}
                                step={0.01}
                                value={temperature}
                                setValue={setTemperature}
                            />
                            <Slider
                                name="核采样（Top P）"
                                description="输出文本的多样性。通常建议只更改温度与核采样的其中一个"
                                min={0}
                                max={1}
                                step={0.01}
                                value={topP}
                                setValue={setTopP}
                            />
                        </div>

                        <span className="text-xl mt-12">安全选项</span>
                        <div className="grid grid-cols-1 gap-6 mt-6">
                            <Select
                                name="仇恨言论和内容"
                                items={safetySettings}
                                value={safetyHateSpeech}
                                setValue={setSafetyHateSpeech}
                            />
                            <Select
                                name="露骨色情内容"
                                items={safetySettings}
                                value={safetySexuallyExplicit}
                                setValue={setSafetySexuallyExplicit}
                            />
                            <Select
                                name="危险内容"
                                items={safetySettings}
                                value={safetyDangerousContent}
                                setValue={setSafetyDangerousContent}
                            />
                            <Select
                                name="骚扰内容"
                                items={safetySettings}
                                value={safetyHarassment}
                                setValue={setSafetyHarassment}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-span-8 lg:col-span-5 2xl:col-span-3 bg-zinc-900 rounded-lg p-6">
                    <div className="flex items-start h-[calc(100dvh-8rem)] lg:h-full">
                        <div
                            className="text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                            <RiUserFill />
                        </div>
                        <div className="ml-4 flex flex-col flex-1 h-full">
                            <textarea
                                className="w-full flex flex-1 p-4 bg-neutral-900 border rounded-lg resize-none focus-within:outline-none"
                                placeholder="想和 Gemini 聊点什么？"
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="flex items-center gap-2 justify-center w-full h-10 text-base rounded-md border border-gray-500 mt-6 transition duration-300 hover:bg-zinc-700 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleRequest}
                                disabled={loading}
                            >
                                <RiSendPlaneFill />
                                和 Gemini 聊一聊
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-span-8 lg:col-span-8 2xl:col-span-3 bg-zinc-900 rounded-lg p-6">
                    <div className="flex items-start h-[calc(100dvh-8rem)] lg:h-full">
                        <div
                            className="text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                            <RiQuillPenFill />
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
                                <div
                                    className="flex bg-red-800 items-center justify-center w-full h-fit p-2 rounded-xl">
                                    Gemini 暂时无法回答问题……
                                </div>
                            )}
                            {showWarning && (
                                <div className="flex bg-orange-800 items-center justify-center w-full h-fit p-2 rounded-xl">
                                    Gemini 沉默不语，有可能是因为你的提问次数太多，或是问题违反了一些准则
                                </div>
                            )}
                            {showChat && (
                                <div className="flex flex-col flex-1 h-full">
                                    <textarea
                                        className="w-full flex flex-1 px-0 py-0 bg-transparent border-none rounded-lg resize-none focus-within:outline-none"
                                        placeholder="我是 Gemini，是 Google 开发的多模态 AI 语言模型。"
                                        value={chat}
                                        disabled
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}