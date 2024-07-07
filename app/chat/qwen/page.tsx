'use client';

import {useState} from 'react';
import Image from 'next/image';

import PanelContainer from '@/app/components/PanelContainer';
import PanelHeader from '@/app/components/PanelHeader';
import PanelContent from '@/app/components/PanelContent';
import ConfigPanel from '@/app/components/ConfigPanel';
import Select, {SelectItem} from '@/app/components/Select';
import Slider from '@/app/components/Slider';
import Switch from '@/app/components/Switch';
import PromptPanel from '@/app/components/PromptPanel';
import TextResultPanel from '@/app/components/TextResultPanel';

import {requestQwen} from '@/app/services';

export default function Page() {
  const models: SelectItem[] = [
    {content: "通义千问-Max", value: "qwen-max"},
    {content: "通义千问-Plus", value: "qwen-plus"},
    {content: "通义千问-Turbo", value: "qwen-turbo"}
  ];

  const [model, setModel] = useState(models[0]);
  const [temperature, setTemperature] = useState(0.85);
  const [topP, setTopP] = useState(0.8);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.1);
  const [search, setSearch] = useState(true);

  const [result, setResult] = useState("");
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = (prompt: string) => {
    setResult("");
    setShowError(false);
    setShowWarning(false);
    setLoading(true);

    requestQwen({
      model: model.value,
      input: {
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      parameters: {
        temperature,
        top_p: topP,
        repetition_penalty: repetitionPenalty,
        enable_search: search
      }
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
            src="/Qwen.png"
            alt="通义千问"
            width={420}
            height={420}
          />
        }
        title="通义千问"
        description="通义千问是由阿里云自主研发的大语言模型"
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
              name="重复惩罚（Repetition Penalty）"
              description="较高的数值可以降低模型生成的重复度"
              min={1}
              max={2}
              step={0.01}
              value={repetitionPenalty}
              setValue={setRepetitionPenalty}
            />
            <Switch
              name="互联网搜索"
              selected={search}
              setSelected={setSearch}
            />
          </div>
        </ConfigPanel>

        <PromptPanel
          promptPlaceholder="想和通义千问聊点什么？"
          buttonText="和通义千问聊一聊"
          loading={loading}
          onRequest={handleRequest}
        />

        <TextResultPanel
          result={result}
          resultPlaceholder="我是阿里云开发的一款超大规模语言模型，我叫通义千问。"
          errorText="通义千问暂时无法回答问题……"
          warningText="通义千问沉默不语，有可能是因为你的问题违反了一些准则"
          showError={showError}
          showWarning={showWarning}
          loading={loading}
        />
      </PanelContent>
    </PanelContainer>
  );
}