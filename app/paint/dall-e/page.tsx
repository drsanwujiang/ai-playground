'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RiUserFill, RiSendPlaneFill, RiBrushFill } from '@remixicon/react'
import Header from '@/app/components/header';
import Select, { SelectItem } from '@/app/components/select';

import { requestDALLE } from '@/app/services';

export default function Page() {
    const models: SelectItem[] = [
        { content: "DALL·E 3", value: "dall-e-3" },
        { content: "DALL·E 2", value: "dall-e-2" },
    ];
    const sizes: SelectItem[] = [
        { content: "1024 × 1792", value: "1024x1792", width: 1024, height: 1792 },
        { content: "1792 × 1024", value: "1792x1024", width: 1792, height: 1024 },
        { content: "1024 × 1024", value: "1024x1024", width: 1024, height: 1024 },
        { content: "512 × 512", value: "512x512", width: 512, height: 512 },
        { content: "256 × 256", value: "256x256", width: 256, height: 256 },
    ];
    const qualities: SelectItem[] = [
        { content: "高清", value: "hd" },
        { content: "标准", value: "standard" },
    ];
    const styles: SelectItem[] = [
        { content: "生动", value: "vivid" },
        { content: "自然", value: "natural" },
    ];

    const [model, setModel] = useState(models[0]);
    const [size, setSize] = useState(sizes[2]);
    const [quality, setQuality] = useState(qualities[0]);
    const [style, setStyle] = useState(styles[0]);

    const [prompt, setPrompt] = useState('');
    const [imageSize, setImageSize] = useState(sizes[2]);
    const [imageSource, setImageSource] = useState('/dall-e-example.png');

    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [showImage, setShowImage] = useState(true);

    const handleRequest = () => {
        setPrompt(prompt.trim());

        if (prompt.length === 0) {
            return;
        }

        setLoading(true);
        setShowError(false);
        setShowWarning(false);
        setShowImage(false);

        requestDALLE({
            model: model.value,
            prompt,
            size: size.value,
            quality: quality.value,
            style: style.value,
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
                    setImageSize(size);
                    setImageSource(`data:image/webp;base64,${data.data.content}`);
                    setShowImage(true);
                } else {
                    setShowWarning(true);
                }
            });
    };

    // @ts-ignore
    return (
        <div className="flex flex-col h-full gap-4 overflow-y-auto lg:overflow-y-hidden">
            <Header
                image={
                    <Image
                        className="object-cover h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
                        src="/DALL-E_3.jpg"
                        alt="DALL·E 3"
                        width={512}
                        height={512}
                    />
                }
                title="DALL·E"
                description="DALL·E 是一个可以通过文本描述生成图像的人工智能程序"
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
                            <Select
                                name="尺寸（Size）"
                                description="仅 DALL·E 3 支持生成 1792 × 1024 和 1024 × 1792 大小的图片"
                                items={sizes}
                                value={size}
                                setValue={setSize}
                            />
                            <Select
                                name="质量（Quality）"
                                description="图片质量。仅对 DALL·E 3 生效"
                                items={qualities}
                                value={quality}
                                setValue={setQuality}
                            />
                            <Select
                                name="风格（Style）"
                                description="图片风格。仅对 DALL·E 3 生效"
                                items={styles}
                                value={style}
                                setValue={setStyle}
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
                                placeholder="告诉 DALL·E 你想描绘什么"
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
                                让 DALL·E 想象一下
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-span-8 lg:col-span-8 2xl:col-span-3 bg-zinc-900 rounded-lg p-6">
                    <div className="flex items-start h-[calc(100dvh-8rem)] lg:h-full">
                        <div
                            className="text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                            <RiBrushFill />
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
                                    DALL·E 的想象力暂时耗尽了……
                                </div>
                            )}
                            {showWarning && (
                                <div
                                    className="flex bg-orange-800 items-center justify-center w-full h-fit p-2 rounded-xl">
                                    DALL·E 想不出来，有可能是因为你的描述违反了一些准则
                                </div>
                            )}
                            {showImage && (
                                <div className="p-3 rounded-lg bg-zinc-800">
                                    <Image
                                        src={imageSource}
                                        alt="DALL·E Image Generation"
                                        width={imageSize.width}
                                        height={imageSize.height}
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