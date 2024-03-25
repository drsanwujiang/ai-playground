'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RiUserFill, RiSendPlaneFill, RiQuillPenFill } from '@remixicon/react'
import Header from '@/app/components/header';
import Select, { SelectItem } from '@/app/components/select';
import Slider from '@/app/components/slider';
import Switch from '@/app/components/switch';

import { requestErnie } from '@/app/services';

export default function Page() {
    const models: SelectItem[] = [
        { content: "ERNIE 4.0", value: "completions_pro" },
        { content: "ERNIE 3.5", value: "completions" },
    ];

    const [model, setModel] = useState(models[0]);
    const [temperature, setTemperature] = useState(0.8);
    const [topP, setTopP] = useState(0.8);
    const [penaltyScore, setPenaltyScore] = useState(1.0);
    const [search, setSearch] = useState(true);

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

        requestErnie(model.value, {
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_output_tokens: 2048,
            temperature,
            top_p: topP,
            penalty_score: penaltyScore,
            disable_search: !search,
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
                        src="/ERNIE.png"
                        alt="文心一言"
                        width={3000}
                        height={3000}
                    />
                }
                title="文心一言"
                description="文心一言是百度打造出来的人工智能大语言模型"
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
                                min={0.01}
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
                            <Slider
                                name="惩罚分数（Penalty Score）"
                                description="通过对已生成的 Token 增加惩罚，减少重复生成的现象"
                                min={1}
                                max={2}
                                step={0.01}
                                value={penaltyScore}
                                setValue={setPenaltyScore}
                            />
                            <Switch
                                name="实时搜索"
                                selected={search}
                                setSelected={setSearch}
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
                                placeholder="想和文心一言聊点什么？"
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
                                和文心一言聊一聊
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
                                    文心一言暂时无法回答问题……
                                </div>
                            )}
                            {showWarning && (
                                <div
                                    className="flex bg-orange-800 items-center justify-center w-full h-fit p-2 rounded-xl">
                                    文心一言沉默不语，有可能是因为你的问题违反了一些准则
                                </div>
                            )}
                            {showChat && (
                                <div className="flex flex-col flex-1 h-full">
                                    <textarea
                                        className="w-full flex flex-1 px-0 py-0 bg-transparent border-none rounded-lg resize-none focus-within:outline-none"
                                        placeholder="我是百度公司开发的人工智能语言模型，我的中文名是文心一言，英文名是ERNIE Bot，我可以为人类提供信息解决问题，比如回答问题，提供定义、解释和建议，也可以辅助人类进行创作产生新的内容，如文本生成与创作、文本改写等。如果您有任何问题，请随时向我提问。"
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