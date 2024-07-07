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

import {requestGemini} from '@/app/services';

export default function Page() {
  const models: SelectItem[] = [
    {content: "Gemini 1.5 Pro", value: "gemini-1.5-pro"},
    {content: "Gemini 1.5 Flash", value: "gemini-1.5-flash"},
    {content: "Gemini 1.0 Pro", value: "gemini-1.0-pro"}
  ];
  const safetySettings: SelectItem[] = [
    {content: "未指定阈值", value: "HARM_BLOCK_THRESHOLD_UNSPECIFIED"},
    {content: "允许微不足道的此类内容", value: "BLOCK_LOW_AND_ABOVE"},
    {content: "允许少量的此类内容", value: "BLOCK_MEDIUM_AND_ABOVE"},
    {content: "允许中等数量的此类内容", value: "BLOCK_ONLY_HIGH"},
    {content: "允许所有此类内容", value: "BLOCK_NONE"}
  ];

  const [model, setModel] = useState(models[0]);
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(0.95);
  const [safetyHateSpeech, setSafetyHateSpeech] = useState(safetySettings[0]);
  const [safetySexuallyExplicit, setSafetySexuallyExplicit] = useState(safetySettings[0]);
  const [safetyDangerousContent, setSafetyDangerousContent] = useState(safetySettings[0]);
  const [safetyHarassment, setSafetyHarassment] = useState(safetySettings[0]);

  const [result, setResult] = useState("");
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = (prompt: string, image: File | undefined, imageData: string) => {
    setResult("");
    setShowError(false);
    setShowWarning(false);
    setLoading(true);

    const parts = [
      {
        text: prompt
      }
    ];

    if (image) {
      parts.push({
        // @ts-ignore
        inlineData: {
          "mimeType": image.type,
          "data": imageData.split(",")[1]
        }
      })
    }

    requestGemini(model.value, {
      contents: [
        {
          role: "user",
          parts: parts
        }
      ],
      generationConfig: {
        temperature,
        topP
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: safetyHateSpeech.value
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: safetySexuallyExplicit.value
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: safetyDangerousContent.value
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: safetyHarassment.value
        }
      ]
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
            src="/Gemini_Pro.png"
            alt="Gemini Pro"
            width={512}
            height={512}
          />
        }
        title="Gemini"
        description="Gemini 是一个多模态大型语言模型系列，由 Google DeepMind 开发"
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
        </ConfigPanel>

        <PromptPanel
          promptPlaceholder="想和 Gemini 聊点什么？"
          imageUploadTips={<span>仅 <span className="font-semibold">Gemini 1.5</span> 支持图片输入，支持 JPG、PNG、WEBP 格式</span>}
          buttonText="和 Gemini 聊一聊"
          loading={loading}
          onRequest={handleRequest}
          allowImage
        />

        <TextResultPanel
          result={result}
          resultPlaceholder="我是一个大型语言模型，由 Google 训练。我被训练成能够进行对话，并能以信息丰富的方式回答各种各样的问题。我可以提供信息、生成文本，并帮助完成各种语言相关的任务。"
          errorText="Gemini 暂时无法回答问题……"
          warningText="Gemini 沉默不语，有可能是因为你的提问次数太多，或是问题违反了一些准则"
          showError={showError}
          showWarning={showWarning}
          loading={loading}
        />
      </PanelContent>
    </PanelContainer>
  );
}