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

import {requestDALLE} from '@/app/services';

export default function Page() {
  const models: SelectItem[] = [
    {content: "DALL·E 3", value: "dall-e-3"},
    {content: "DALL·E 2", value: "dall-e-2"}
  ];
  const sizes: SelectItem[] = [
    {content: "1024 × 1792", value: "1024x1792", width: 1024, height: 1792},
    {content: "1792 × 1024", value: "1792x1024", width: 1792, height: 1024},
    {content: "1024 × 1024", value: "1024x1024", width: 1024, height: 1024},
    {content: "512 × 512", value: "512x512", width: 512, height: 512},
    {content: "256 × 256", value: "256x256", width: 256, height: 256}
  ];
  const qualities: SelectItem[] = [
    {content: "高清", value: "hd"},
    {content: "标准", value: "standard"}
  ];
  const styles: SelectItem[] = [
    {content: "生动", value: "vivid"},
    {content: "自然", value: "natural"}
  ];

  const [model, setModel] = useState(models[0]);
  const [size, setSize] = useState(sizes[2]);
  const [quality, setQuality] = useState(qualities[0]);
  const [style, setStyle] = useState(styles[0]);

  const [imageSource, setImageSource] = useState('/dall-e-example.png');
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = (prompt: string) => {
    setImageSource("");
    setShowError(false);
    setShowWarning(false);
    setLoading(true);

    requestDALLE({
      model: model.value,
      prompt,
      size: size.value,
      quality: quality.value,
      style: style.value,
      n: 1,
      response_format: "b64_json"
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
          setImageSource(`data:image/webp;base64,${data.data.content}`);
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
            src="/DALL-E_3.jpg"
            alt="DALL·E 3"
            width={512}
            height={512}
          />
        }
        title="DALL·E"
        description="DALL·E 是一个可以通过文本描述生成图像的人工智能程序"
      />

      <PanelContent>
        <ConfigPanel>
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
        </ConfigPanel>

        <PromptPanel
          promptPlaceholder="想让 DALL·E 描绘什么"
          buttonText="让 DALL·E 想象一下"
          loading={loading}
          onRequest={handleRequest}
        />

        <ImageResultPanel
          imageSource={imageSource}
          errorText="DALL·E 的想象力暂时耗尽了……"
          warningText="DALL·E 想象不出来，有可能是因为你的描述违反了一些准则"
          showError={showError}
          showWarning={showWarning}
          loading={loading}
        />
      </PanelContent>
    </PanelContainer>
  );
}