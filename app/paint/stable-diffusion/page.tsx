'use client';

import {useState} from 'react';
import Image from 'next/image';

import PanelContainer from '@/app/components/PanelContainer';
import PanelHeader from '@/app/components/PanelHeader';
import PanelContent from '@/app/components/PanelContent';
import ConfigPanel from '@/app/components/ConfigPanel';
import Select, {SelectItem} from '@/app/components/Select';
import PromptPanel from '@/app/components/PromptPanel';
import ImageResultPanel from '@/app/components/ImageResultPanel';

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

  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageSource, setImageSource] = useState('/stable-diffusion-example.png');
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = (prompt: string) => {
    setImageSource("");
    setShowError(false);
    setShowWarning(false);
    setLoading(true);

    requestStableDiffusion(service.value, {
      model: service.value === services[2].value ? model.value : null,
      prompt,
      negative_prompt: negativePrompt,
      aspect_ratio: aspectRatio.value,
      output_format: "png"
    })
      .catch(() => {
        setShowError(true);
        setLoading(false);

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
        } else {
          setShowWarning(true);
        }
      });
  };

  // @ts-ignore
  return (
    <PanelContainer>
      <PanelHeader
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

      <PanelContent>
        <ConfigPanel>
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
        </ConfigPanel>

        <PromptPanel
          promptPlaceholder="想让 Stable Diffusion 描绘什么"
          buttonText="让 Stable Diffusion 想象一下"
          loading={loading}
          onRequest={handleRequest}
        >
          <textarea
            className="w-full flex flex-1 p-4 mt-6 bg-neutral-900 border rounded-lg resize-none focus-within:outline-none disabled:opacity-50 disabled:pointer-events-none"
            placeholder="告诉 Stable Diffusion 不要想象什么（可选）"
            value={negativePrompt}
            onChange={e => setNegativePrompt(e.target.value)}
            disabled={loading}
          />
        </PromptPanel>

        <ImageResultPanel
          imageSource={imageSource}
          errorText="Stable Diffusion 的想象力暂时耗尽了……"
          warningText="Stable Diffusion 想象不出来，有可能是因为你的描述违反了一些准则"
          showError={showError}
          showWarning={showWarning}
          loading={loading}
        />
      </PanelContent>
    </PanelContainer>
  );
}