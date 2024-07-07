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

import {requestErnie} from '@/app/services';

export default function Page() {
  const models: SelectItem[] = [
    {content: "ERNIE 4.0 Turbo", value: "ernie-4.0-turbo-8k"},
    {content: "ERNIE 4.0", value: "completions_pro"},
    {content: "ERNIE 3.5", value: "completions"}
  ];

  const [model, setModel] = useState(models[0]);
  const [temperature, setTemperature] = useState(0.8);
  const [topP, setTopP] = useState(0.8);
  const [penaltyScore, setPenaltyScore] = useState(1.0);
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

    requestErnie(model.value, {
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_output_tokens: 2048,
      temperature,
      top_p: topP,
      penalty_score: penaltyScore,
      disable_search: !search
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
            src="/ERNIE.png"
            alt="文心一言"
            width={3000}
            height={3000}
          />
        }
        title="文心一言"
        description="文心一言是百度打造出来的人工智能大语言模型"
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
        </ConfigPanel>

        <PromptPanel
          promptPlaceholder="想和文心一言聊点什么？"
          buttonText="和文心一言聊一聊"
          loading={loading}
          onRequest={handleRequest}
        />

        <TextResultPanel
          result={result}
          resultPlaceholder="你好，我是百度公司研发的知识增强大语言模型，我的中文名是文心一言，英文名是ERNIE Bot。我能够与人对话互动，回答问题，协助创作，高效便捷地帮助人们获取信息、知识和灵感。如果你有任何问题或需要帮助，请随时告诉我，我将竭诚为你服务。"
          errorText="文心一言暂时无法回答问题……"
          warningText="文心一言沉默不语，有可能是因为你的问题违反了一些准则"
          showError={showError}
          showWarning={showWarning}
          loading={loading}
        />
      </PanelContent>
    </PanelContainer>
  );
}