'use client';

import {useState} from 'react';
import Image from 'next/image';

import PanelContainer from '@/app/components/PanelContainer';
import PanelHeader from '@/app/components/PanelHeader';
import PanelContent from '@/app/components/PanelContent';
import ConfigPanel from '@/app/components/ConfigPanel';
import Select, {SelectItem} from '@/app/components/Select';
import Slider from '@/app/components/Slider';
import PromptPanel from '@/app/components/PromptPanel';
import TextResultPanel from '@/app/components/TextResultPanel';

import {requestClaude} from '@/app/services';

export default function Page() {
  const models: SelectItem[] = [
    {content: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20240620"},
    {content: "Claude 3 Opus", value: "claude-3-opus-20240229"},
    {content: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229"},
    {content: "Claude 3 Haiku", value: "claude-3-haiku-20240307"}
  ];

  const [model, setModel] = useState(models[0]);
  const [temperature, setTemperature] = useState(1.0);
  const [topP, setTopP] = useState(0.99);

  const [result, setResult] = useState("");
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = (prompt: string, image: File | undefined, imageData: string) => {
    setResult("");
    setShowError(false);
    setShowWarning(false);
    setLoading(true);

    const content = [
      {
        type: "text",
        text: prompt
      }
    ];

    if (image) {
      content.push({
        type: "image",
        // @ts-ignore
        source: {
          "type": "base64",
          "media_type": image.type,
          "data": imageData.split(",")[1]
        }
      })
    }

    requestClaude({
      model: model.value,
      messages: [
        {
          role: "user",
          content: content
        }
      ],
      max_tokens: 4096,
      temperature,
      top_p: topP
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
          setResult(data.data.content);
        } else {
          setShowWarning(true);
        }
      });
  };

  return (
    <PanelContainer>
      <PanelHeader
        image={
          <Image
            className="object-cover h-full w-full shadow-[5px_0_30px_0px_rgba(0,0,0,0.3)]"
            src="/Claude-3.webp"
            alt="Claude-3"
            width={2880}
            height={1620}
          />
        }
        title="Claude"
        description="Claude 是 Anthropic 开发的一个大型语言模型家族"
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
        </ConfigPanel>

        <PromptPanel
          promptPlaceholder="想和 Claude 聊点什么？"
          imageUploadTips="支持 JPG、PNG、WEBP 格式"
          buttonText="和 Claude 聊一聊"
          loading={loading}
          onRequest={handleRequest}
          allowImage
        />

        <TextResultPanel
          result={result}
          resultPlaceholder="我是Claude,一个由Anthropic公司开发的人工智能助手。我的目标是帮助人类并与人类进行有意义的对话。很高兴认识你!"
          errorText="Claude 暂时无法回答问题……"
          warningText="Claude 沉默不语，有可能是因为你的问题违反了一些准则"
          showError={showError}
          showWarning={showWarning}
          loading={loading}
        />
      </PanelContent>
    </PanelContainer>
  );
}