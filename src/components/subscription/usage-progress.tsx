'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useSubscriptionStore } from '@/stores/subscription-store';
import { AlertTriangle, BarChart3, Calendar, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * 使用量进度显示组件
 *
 * 显示用户当前的使用量、配额和进度条
 * 支持警告提示和实时数据更新
 */
export function UsageProgress() {
  const { subscription, usage, isLoading, error, fetchAllData } =
    useSubscriptionStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 组件挂载时获取最新数据
    if (!subscription || !usage) {
      fetchAllData();
    }
  }, [subscription, usage, fetchAllData]);

  // 手动刷新数据
  const handleRefresh = async () => {
    await fetchAllData();
  };

  // 获取使用量状态样式
  const getUsageStatus = () => {
    if (!usage)
      return {
        variant: 'secondary' as const,
        text: 'Unknown',
        color: 'text-muted-foreground',
      };

    if (usage.isOverLimit) {
      return {
        variant: 'destructive' as const,
        text: 'Limit Exceeded',
        color: 'text-red-600',
      };
    }

    if (usage.isNearLimit) {
      return {
        variant: 'outline' as const,
        text: 'Near Limit',
        color: 'text-amber-600',
      };
    }

    return {
      variant: 'secondary' as const,
      text: 'Normal',
      color: 'text-green-600',
    };
  };

  // 获取进度条颜色
  const getProgressColor = () => {
    if (!usage) return '';

    if (usage.isOverLimit) {
      return 'bg-red-500';
    }

    if (usage.isNearLimit) {
      return 'bg-amber-500';
    }

    return 'bg-slate-500';
  };

  // 格式化重置时间
  const formatResetTime = (date: Date | null) => {
    if (!date) return 'Unknown';

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffHours <= 0) {
      return 'Resetting soon';
    }

    if (diffHours < 24) {
      return `Resets in ${diffHours}h`;
    }

    const diffDays = Math.ceil(diffHours / 24);
    return `Resets in ${diffDays}d`;
  };

  if (!mounted) {
    return null;
  }

  const status = getUsageStatus();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Usage Overview
          </CardTitle>
          <CardDescription className="text-sm">
            Track your current usage and remaining quota
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={status.variant} className="text-xs">
            {status.text}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-7 w-7 p-0"
          >
            <RefreshCw className={cn('h-3 w-3', isLoading && 'animate-spin')} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>Failed to load usage data: {error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        ) : usage ? (
          <>
            {/* 使用量进度条 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Characters Used</span>
                <span className={cn('font-semibold', status.color)}>
                  {usage.currentUsage.toLocaleString()} /{' '}
                  {usage.limit.toLocaleString()}
                </span>
              </div>

              <div className="relative">
                <Progress
                  value={Math.min(usage.usagePercentage, 100)}
                  className="h-2"
                />
                <div
                  className={cn(
                    'absolute top-0 left-0 h-2 rounded-full transition-all duration-500',
                    getProgressColor()
                  )}
                  style={{ width: `${Math.min(usage.usagePercentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{usage.usagePercentage.toFixed(0)}% used</span>
                <span>{usage.remainingQuota.toLocaleString()} remaining</span>
              </div>
            </div>

            {/* 计划信息 */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Current Plan
                </div>
                <div className="font-semibold text-sm">
                  {subscription?.planConfig.name || 'Free'}
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Reset Period
                </div>
                <div className="font-semibold text-sm">
                  {formatResetTime(usage.nextResetTime)}
                </div>
              </div>
            </div>

            {/* 警告提示 */}
            {usage.isNearLimit && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-sm">
                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-xs">Usage Warning</div>
                  <div className="text-xs mt-0.5">
                    You've used {usage.usagePercentage.toFixed(0)}% of your{' '}
                    {usage.period} quota. Consider upgrading to avoid service
                    interruption.
                  </div>
                </div>
              </div>
            )}

            {usage.isOverLimit && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-sm">
                <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-xs">Limit Exceeded</div>
                  <div className="text-xs mt-0.5">
                    You've exceeded your {usage.period} quota. Please upgrade
                    your plan to continue using the service.
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <div className="text-sm">No usage data available</div>
            <div className="text-xs mt-1">
              Usage tracking will begin after your first generation
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 简化版使用量组件
 * 用于在侧边栏或其他紧凑空间显示
 */
export function CompactUsageProgress() {
  const { usage, isLoading } = useSubscriptionStore();

  if (isLoading || !usage) {
    return (
      <div className="space-y-2">
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    );
  }

  const getProgressColor = () => {
    if (usage.isOverLimit) return 'bg-red-500';
    if (usage.isNearLimit) return 'bg-amber-500';
    return 'bg-slate-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Usage</span>
        <span className="font-medium">
          {usage.currentUsage} / {usage.limit}
        </span>
      </div>

      <div className="relative">
        <Progress
          value={Math.min(usage.usagePercentage, 100)}
          className="h-2"
        />
        <div
          className={cn(
            'absolute top-0 left-0 h-2 rounded-full transition-all duration-300',
            getProgressColor()
          )}
          style={{ width: `${Math.min(usage.usagePercentage, 100)}%` }}
        />
      </div>

      <div className="text-xs text-muted-foreground text-center">
        {usage.usagePercentage.toFixed(0)}% used
      </div>
    </div>
  );
}
