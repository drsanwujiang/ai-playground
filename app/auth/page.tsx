'use client';

import {useState} from 'react';
import {SHA256} from 'crypto-js';
import {RiLockUnlockFill} from '@remixicon/react';

import {auth} from '@/app/services';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [credential, setCredential] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleRequest = () => {
    setCredential(credential.trim());

    if (credential.length === 0) {
      return;
    }

    const token = SHA256(credential).toString();

    setLoading(true);
    setShowMessage(false);

    auth(token)
      .catch(() => {
        setMessage("暂时无法验证你的暗号，请稍后再试");
        setShowMessage(true);
        setLoading(false);

        return Promise.reject();
      })
      .then(response => {
        setLoading(false);

        if (response.status === 200) {
          window.location.href = "/";
        } else if (response.status === 401) {
          setMessage("咦，没有见过这个暗号哦……");
          setShowMessage(true);
        } else {
          setMessage("暂时无法验证你的暗号，请稍后再试");
          setShowMessage(true);
        }
      });
  };

  return (
    <div className="flex flex-col h-full items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <div
        className="flex flex-col items-center justify-center w-full h-[30%] rounded-lg shadow md:mt-0 sm:max-w-screen-lg xl:p-0 bg-zinc-900">
        <div className="p-6 space-y-4 w-full md:space-y-6 sm:p-8 sm:max-w-screen-sm">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            准备好前往 AI 生成的世界了吗……
          </h1>
          <div className="space-y-4 md:space-y-6">
            <input
              className="border rounded-lg block w-full h-12 p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              type="password"
              placeholder="请输入我们的秘密暗号"
              value={credential}
              onChange={e => setCredential(e.target.value)}
            />
            {showMessage && (
              <div className="flex bg-red-950 items-center justify-center w-full h-10 rounded-xl">
                {message}
              </div>
            )}
            <button
              className="flex items-center gap-2 justify-center w-full h-10 text-base rounded-md border border-gray-500 mt-6 transition duration-300 hover:bg-zinc-700 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleRequest}
              disabled={loading}
            >
              <RiLockUnlockFill/>
              AI 开门
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}