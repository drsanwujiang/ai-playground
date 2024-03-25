'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RiEmotionHappyFill, RiEmotionUnhappyFill, RiSendPlaneFill, RiBrushFill } from '@remixicon/react'
import Header from '@/app/components/header';
import Select, { SelectItem } from '@/app/components/select';
import Slider from "@/app/components/slider";

import { requestStableDiffusion } from '@/app/services';

export default function Page() {
    const models: SelectItem[] = [
        { content: "Stable Diffusion XL v1.0", value: "stable-diffusion-xl-1024-v1-0" },
        { content: "Stable Diffusion v1.6", value: "stable-diffusion-v1-6" },
    ];
    const sizes: SelectItem[] = [
        { content: "1024 × 1024", value: "1024x1024", width: 1024, height: 1024 },
        { content: "1152 × 896", value: "1152x896", width: 1152, height: 896 },
        { content: "896 × 1152", value: "896x1152", width: 896, height: 1152 },
        { content: "1216 × 832", value: "1216x832", width: 1216, height: 832 },
        { content: "1344 × 768", value: "1344x768", width: 1344, height: 768 },
        { content: "768 × 1344", value: "768x1344", width: 768, height: 1344 },
        { content: "1536 × 640", value: "1536x640", width: 1536, height: 640 },
        { content: "640 × 1536", value: "640x1536", width: 640, height: 1536 },
    ];
    const samplers: SelectItem[] = [
        { content: "自动", value: "" },
        { content: "DDIM", value: "DDIM" },
        { content: "DDPM", value: "DDPM" },
        { content: "K_DPMPP_2M", value: "K_DPMPP_2M" },
        { content: "K_DPMPP_2S_ANCESTRAL", value: "K_DPMPP_2S_ANCESTRAL" },
        { content: "K_DPM_2", value: "K_DPM_2" },
        { content: "K_DPM_2_ANCESTRAL", value: "K_DPM_2_ANCESTRAL" },
        { content: "K_EULER", value: "EULER" },
        { content: "K_EULER_ANCESTRAL", value: "K_EULER_ANCESTRAL" },
        { content: "K_HEUN", value: "K_HEUN" },
        { content: "K_LMS", value: "K_LMS" },
    ];
    const stylePresets: SelectItem[] = [
        { content: "无", value: "" },
        { content: "3D 模型", value: "3d-model" },
        { content: "模拟电影", value: "analog-film" },
        { content: "动漫", value: "anime" },
        { content: "电影", value: "cinematic" },
        { content: "漫画", value: "comic-book" },
        { content: "数字艺术", value: "digital-art" },
        { content: "增强", value: "enhance" },
        { content: "幻想艺术", value: "fantasy-art" },
        { content: "等距图像", value: "isometric" },
        { content: "线条艺术", value: "line-art" },
        { content: "低多边形", value: "low-poly" },
        { content: "塑造复合", value: "modeling-compound" },
        { content: "霓虹朋克", value: "neon-punk" },
        { content: "折纸", value: "origami" },
        { content: "照片", value: "photographic" },
        { content: "像素艺术", value: "pixel-art" },
        { content: "无缝拼接", value: "tile-texture" },
    ];

    const [model, setModel] = useState(models[0]);
    const [size, setSize] = useState(sizes[0]);
    const [scale, setScale] = useState(7);
    const [step, setStep] = useState(30);
    const [sampler, setSampler] = useState(samplers[0]);
    const [stylePreset, setStylePreset] = useState(stylePresets[0]);

    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [imageSize, setImageSize] = useState(sizes[0]);
    const [imageSource, setImageSource] = useState('/stable-diffusion-example.png');

    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [showImage, setShowImage] = useState(true);

    const handleRequest = () => {
        setPrompt(prompt.trim());
        setNegativePrompt(negativePrompt.trim());

        if (prompt.length === 0) {
            return;
        }

        setLoading(true);
        setShowError(false);
        setShowWarning(false);
        setShowImage(false);

        const prompts = [
            {
                text: prompt,
                weight: 1,
            },
        ];

        if (negativePrompt.length > 0) {
            prompts.push({
                text: negativePrompt,
                weight: -1,
            });
        }

        requestStableDiffusion(model.value, {
            height: size.height,
            width: size.width,
            text_prompt: prompts,
            cfg_scale: scale,
            steps: step,
            sampler: sampler.value,
            style_preset: stylePreset.value,
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
                    setImageSource(`data:image/png;base64,${data.data.content}`);
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
                        src="/Stable_Diffusion.png"
                        alt="Stable Diffusion"
                        width={512}
                        height={512}
                    />
                }
                title="Stable Diffusion"
                description="Stable Diffusion 是由 Stability AI、CompVis 与 Runway 合作开发的深度学习文本到图像生成模型"
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
                                items={sizes}
                                value={size}
                                setValue={setSize}
                            />
                            <Slider
                                name="相关性（Scale）"
                                description="扩散过程遵循 Prompt 的严格程度。值越高，结果越接近 Prompt；值越低，越可能产生有创意的结果"
                                min={0}
                                max={35}
                                step={1}
                                value={scale}
                                setValue={setScale}
                            />
                            <Slider
                                name="迭代次数（Step）"
                                description="采样器计算的迭代次数，并非越多越好"
                                min={10}
                                max={50}
                                step={1}
                                value={step}
                                setValue={setStep}
                            />
                            <Select
                                name="采样器（Sampler）"
                                description="扩散过程要使用的采样器"
                                items={samplers}
                                value={sampler}
                                setValue={setSampler}
                            />
                            <Select
                                name="预设风格（Style Preset）"
                                description="引导模型生成特定风格的图片"
                                items={stylePresets}
                                value={stylePreset}
                                setValue={setStylePreset}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-span-8 lg:col-span-5 2xl:col-span-3 bg-zinc-900 rounded-lg p-6">
                    <div className="flex flex-col h-[calc(100dvh-8rem)] lg:h-full gap-6">
                        <div className="flex flex-1 items-start">
                            <div
                                className="text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                                <RiEmotionHappyFill/>
                            </div>
                            <div className="ml-4 flex flex-col flex-1 h-full">
                                <textarea
                                    className="w-full flex flex-1 p-4 bg-neutral-900 border rounded-lg resize-none focus-within:outline-none"
                                    placeholder="告诉 Stable Diffusion 你想描绘什么"
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-1 items-start">
                            <div
                                className="text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                                <RiEmotionUnhappyFill/>
                            </div>
                            <div className="ml-4 flex flex-col flex-1 h-full">
                                <textarea
                                    className="w-full flex flex-1 p-4 bg-neutral-900 border rounded-lg resize-none focus-within:outline-none"
                                    placeholder="告诉 Stable Diffusion 不要想象什么"
                                    value={negativePrompt}
                                    onChange={e => setNegativePrompt(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 justify-center w-full h-10 text-base rounded-md border border-gray-500 mt-6 transition duration-300 hover:bg-zinc-700 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleRequest}
                                    disabled={loading}
                                >
                                    <RiSendPlaneFill/>
                                    让 Stable Diffusion 想象一下
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-8 lg:col-span-8 2xl:col-span-3 bg-zinc-900 rounded-lg p-6">
                    <div className="flex items-start h-[calc(100dvh-8rem)] lg:h-full">
                        <div
                            className="text-primary-foreground flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
                            <RiBrushFill/>
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
                                    Stable Diffusion 的想象力暂时耗尽了……
                                </div>
                            )}
                            {showWarning && (
                                <div
                                    className="flex bg-orange-800 items-center justify-center w-full h-fit p-2 rounded-xl">
                                    Stable Diffusion 想不出来，有可能是因为你的描述违反了一些准则
                                </div>
                            )}
                            {showImage && (
                                <div className="p-3 rounded-lg bg-zinc-800">
                                    <Image
                                        src={imageSource}
                                        alt="Stable Diffusion Image Generation"
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