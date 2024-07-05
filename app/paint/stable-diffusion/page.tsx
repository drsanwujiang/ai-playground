'use client';

import {useState} from 'react';
import Image from 'next/image';
import {RiEmotionHappyFill, RiEmotionUnhappyFill, RiSendPlaneFill, RiBrushFill} from '@remixicon/react'
import Header from '@/app/components/header';
import Select, {SelectItem} from '@/app/components/select';

import {requestStableDiffusion} from '@/app/services';

export default function Page() {
  const services: SelectItem[] = [
    {content: "Stable Image Ultra", value: "ultra"},
    {content: "Stable Image Core", value: "core"},
    {content: "Stable Diffusion 3", value: "sd3"}
  ];
  const models: SelectItem[] = [
    {content: "Stable Diffusion 3 Large Turbo", value: "sd3-large-turbo"},
    {content: "Stable Diffusion 3 Large", value: "sd3-large"},
    {content: "Stable Diffusion 3 Medium", value: "sd3-medium"}
  ];
  const aspectRatios: SelectItem[] = [
    {content: "1:1", value: "1:1"},
    {content: "16:9", value: "16:9"},
    {content: "21:9", value: "21:9"},
    {content: "3:2", value: "3:2"},
    {content: "5:4", value: "5:4"},
    {content: "4:5", value: "4:5"},
    {content: "2:3", value: "2:3"},
    {content: "9:21", value: "9:21"},
    {content: "9:16", value: "9:16"}
  ];

  const [service, setService] = useState(services[0]);
  const [model, setModel] = useState(models[0]);
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]);

  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
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

    requestStableDiffusion(service.value, {
      model: service.value === services[2].value ? model.value : null,
      prompt,
      negative_prompt: negativePrompt,
      aspect_ratio: aspectRatio.value,
      output_format: "png"
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
            <span className="text-xl">服务</span>
            <div className="mt-6">
              <Select
                items={services}
                value={service}
                setValue={setService}
              />
            </div>
            {service.value === services[2].value && (
              <div className="mt-6">
                <Select
                  name="模型"
                  items={models}
                  value={model}
                  setValue={setModel}
                />
              </div>
            )}

            <span className="text-xl mt-12">高级选项</span>
            <div className="grid grid-cols-1 gap-6 mt-6">
              <Select
                name="宽高比（Aspect Ratio）"
                items={aspectRatios}
                value={aspectRatio}
                setValue={setAspectRatio}
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
                  className="w-full flex flex-1 p-4 bg-neutral-900 border rounded-lg resize-none focus-within:outline-none disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="告诉 Stable Diffusion 你想描绘什么"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  disabled={loading}
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
                  className="w-full flex flex-1 p-4 bg-neutral-900 border rounded-lg resize-none focus-within:outline-none disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="告诉 Stable Diffusion 不要想象什么（可选）"
                  value={negativePrompt}
                  onChange={e => setNegativePrompt(e.target.value)}
                  disabled={loading}
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
                  <img src={imageSource} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}