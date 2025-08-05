'use client';

import { useSubscriptionStore } from '@/stores/subscription-store';
import { Clock, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * 免费用户等待组件
 *
 * 显示15秒倒计时加载条，与输入框长度一致的简约设计
 */
export function FreeUserWaiting() {
  const { waitingState, updateWaitingTime, stopWaiting, showUpgradeModal } =
    useSubscriptionStore();
  const [timeLeft, setTimeLeft] = useState(waitingState.remainingTime);

  useEffect(() => {
    if (!waitingState.isWaiting) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(waitingState.remainingTime);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 1);

        // 使用setTimeout避免在渲染过程中更新状态
        setTimeout(() => {
          updateWaitingTime(newTime);

          if (newTime === 0) {
            stopWaiting();
          }
        }, 0);

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    waitingState.isWaiting,
    waitingState.remainingTime,
    updateWaitingTime,
    stopWaiting,
  ]);

  if (!waitingState.isWaiting) {
    return null;
  }

  const progress =
    waitingState.totalWaitTime > 0
      ? ((waitingState.totalWaitTime - timeLeft) / waitingState.totalWaitTime) *
        100
      : 0;

  return (
    <div className="space-y-4">
      {/* 等待提示文本 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">
            Free users need to wait {timeLeft} seconds
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          Upgrade to skip waiting and get instant generation
        </p>
      </div>

      {/* 等待进度条 - 与输入框样式一致 */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] dark:shadow-[inset_6px_6px_12px_#1e293b,inset_-6px_-6px_12px_#475569]">
        {/* 紫色渐变覆盖层 */}
        <div className="absolute inset-4 rounded-2xl pointer-events-none opacity-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />

        {/* 进度条容器 */}
        <div className="relative p-6">
          {/* 进度条背景 */}
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#1e293b,inset_-2px_-2px_4px_#475569]">
            {/* 进度条填充 */}
            <div
              className="h-full bg-gradient-to-r from-slate-400 to-indigo-400 rounded-full transition-all duration-1000 ease-linear shadow-[2px_2px_4px_rgba(100,116,139,0.3),-2px_-2px_4px_rgba(99,102,241,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 时间显示 */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Processing...</span>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
                {timeLeft}s
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 升级提示按钮 */}
      <div className="text-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 bg-gradient-to-br from-slate-500 to-indigo-500 text-white shadow-[3px_3px_6px_rgba(100,116,139,0.3),-3px_-3px_6px_rgba(99,102,241,0.3)] hover:shadow-[2px_2px_4px_rgba(100,116,139,0.4),-2px_-2px_4px_rgba(99,102,241,0.4)] active:shadow-[inset_2px_2px_4px_rgba(100,116,139,0.3),inset_-2px_-2px_4px_rgba(99,102,241,0.3)] hover:scale-105"
          onClick={() => {
            console.log('🚀 [Free User Waiting] Upgrade button clicked');
            // 使用setTimeout避免在渲染过程中更新状态
            setTimeout(() => {
              showUpgradeModal('waiting_period');
            }, 0);
          }}
        >
          <Zap className="h-4 w-4" />
          <span>Upgrade for Instant Generation</span>
        </button>
      </div>
    </div>
  );
}

/**
 * 简化版等待组件 - 仅显示进度条
 * 用于在其他组件中嵌入使用
 */
export function SimpleWaitingBar() {
  const { waitingState } = useSubscriptionStore();
  const [timeLeft, setTimeLeft] = useState(waitingState.remainingTime);

  useEffect(() => {
    if (!waitingState.isWaiting) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(waitingState.remainingTime);

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [waitingState.isWaiting, waitingState.remainingTime]);

  if (!waitingState.isWaiting) {
    return null;
  }

  const progress =
    waitingState.totalWaitTime > 0
      ? ((waitingState.totalWaitTime - timeLeft) / waitingState.totalWaitTime) *
        100
      : 0;

  return (
    <div className="w-full space-y-2">
      {/* 简化的进度条 */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-slate-400 to-indigo-400 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 简化的时间显示 */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
        <span>Free user waiting...</span>
        <span className="font-medium">{timeLeft}s</span>
      </div>
    </div>
  );
}

/**
 * 等待状态钩子
 * 提供等待状态的便捷访问
 */
export function useWaitingState() {
  const { waitingState, startWaiting, stopWaiting, updateWaitingTime } =
    useSubscriptionStore();

  return {
    isWaiting: waitingState.isWaiting,
    remainingTime: waitingState.remainingTime,
    totalWaitTime: waitingState.totalWaitTime,
    progress:
      waitingState.totalWaitTime > 0
        ? ((waitingState.totalWaitTime - waitingState.remainingTime) /
            waitingState.totalWaitTime) *
          100
        : 0,
    startWaiting,
    stopWaiting,
    updateWaitingTime,
  };
}
