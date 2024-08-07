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

import {requestGPT} from '@/app/services';

export default function Page() {
  const models: SelectItem[] = [
    {content: "GPT-4o", value: "gpt-4o"},
    {content: "GPT-4o mini", value: "gpt-4o-mini"},
    {content: "GPT-4 Turbo", value: "gpt-4-turbo"},
    {content: "GPT-4", value: "gpt-4"},
    {content: "GPT-3.5 Turbo", value: "gpt-3.5-turbo"}
  ];

  const [model, setModel] = useState(models[0]);
  const [temperature, setTemperature] = useState(1.0);
  const [topP, setTopP] = useState(1.0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);

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
        type: "image_url",
        // @ts-ignore
        image_url: {
          url: imageData
        }
      });
    }

    requestGPT({
      model: model.value,
      messages: [
        {
          role: "user",
          content: content
        }
      ],
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty
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
            src="/GPT-4.png"
            alt="GPT-4"
            width={1024}
            height={1024}
          />
        }
        title="GPT"
        description="GPT 是 OpenAI 开发的自回归语言模型"
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
              max={2}
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
              name="频率惩罚（Frequency Penalty）"
              description="降低模型逐字重复同一行的可能性"
              min={-2}
              max={2}
              step={0.01}
              value={frequencyPenalty}
              setValue={setFrequencyPenalty}
            />
            <Slider
              name="存在惩罚（Presence Penalty）"
              description="增加模型讨论新主题的可能性"
              min={-2}
              max={2}
              step={0.01}
              value={presencePenalty}
              setValue={setPresencePenalty}
            />
          </div>
        </ConfigPanel>

        <PromptPanel
          promptPlaceholder="想和 GPT 聊点什么？"
          imageUploadTips={<span>仅 <span className="font-semibold">GPT-4o</span> 支持图片输入，支持 JPG、PNG、WEBP 格式</span>}
          buttonText="和 GPT 聊一聊"
          loading={loading}
          onRequest={handleRequest}
          allowImage
        />

        <TextResultPanel
          result={result}
          resultPlaceholder="我是一个由OpenAI开发的人工智能助手，用于回答问题、提供信息和帮助完成各种任务。你可以问我任何问题或请求帮助，我会尽力提供有用的信息或指导。需要帮助吗？"
          errorText="ChatGPT 暂时无法回答问题……"
          warningText="ChatGPT 沉默不语，有可能是因为你的问题违反了一些准则"
          showError={showError}
          showWarning={showWarning}
          loading={loading}
        />
      </PanelContent>
    </PanelContainer>
  );
}