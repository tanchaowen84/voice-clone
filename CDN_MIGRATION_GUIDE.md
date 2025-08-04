# 🚀 CDN迁移指南 - Cloudflare R2静态资源加速

## 📋 迁移概述

本指南将帮助您将静态资源从本地public目录迁移到Cloudflare R2，并通过自定义域名`cdn.voice-clone.org`进行CDN加速。

## 🔧 已完成的代码修改

### 1. 新增CDN配置文件
- ✅ `src/config/cdn-config.ts` - CDN配置和工具函数
- ✅ 支持开发/生产环境切换
- ✅ 自动CDN URL生成

### 2. 更新的文件
- ✅ `next.config.ts` - 添加CDN域名到remotePatterns
- ✅ `src/config/website.tsx` - Logo和OG图片使用CDN
- ✅ `src/lib/urls/urls.ts` - getImageUrl函数支持CDN
- ✅ `src/lib/metadata.ts` - Favicon使用CDN
- ✅ `src/components/blocks/features/features.tsx` - Features图片使用CDN
- ✅ `public/sw.js` - Service Worker缓存CDN资源

### 3. 新增上传脚本
- ✅ `scripts/upload-static-assets.js` - 自动上传脚本
- ✅ `package.json` - 添加upload-assets命令

## 📦 需要迁移的资源

以下资源将从`public/`目录迁移到CDN：

```
✅ aicapabilities.png     - AI能力展示图
✅ favicon-16x16.png      - 16x16 favicon
✅ favicon-32x32.png      - 32x32 favicon  
✅ favicon.ico            - 主favicon
✅ features1.png          - 功能特性图1
✅ features2.png          - 功能特性图2
✅ features3.png          - 功能特性图3
✅ features4.png          - 功能特性图4
✅ howitworks.png         - 工作原理图
✅ logo.png               - 亮色主题Logo
✅ logo-dark.png          - 暗色主题Logo
✅ og.png                 - Open Graph图片
```

## 🚀 执行迁移步骤

### 步骤1: 验证环境变量配置

确保您的`.env`文件包含以下配置：

```bash
# Cloudflare R2 Storage Configuration
STORAGE_REGION="auto"
STORAGE_BUCKET_NAME="voiceclone"
STORAGE_ACCESS_KEY_ID="c30d9715716c2cdaf1b3b9a454e85bca"
STORAGE_SECRET_ACCESS_KEY="3a1021a51250a422d3c6872184acfb29f8ed36c41d6179ea72c1a8f88d854a60"
STORAGE_ENDPOINT="https://fdee8734b76e53341cbdfc715a2e25b1.r2.cloudflarestorage.com"
STORAGE_FORCE_PATH_STYLE="false"
STORAGE_PUBLIC_URL="https://pub-f6665a378c09444695ec824f0b5e58f0.r2.dev"
```

### 步骤2: 上传静态资源到R2

运行上传脚本：

```bash
pnpm upload-assets
```

这将自动上传所有指定的静态资源到您的R2存储桶。

### 步骤3: 验证CDN配置

1. **检查Cloudflare R2控制台**
   - 登录Cloudflare Dashboard
   - 进入R2 Object Storage
   - 确认文件已成功上传

2. **验证自定义域名**
   - 确保`cdn.voice-clone.org`已正确配置
   - 测试访问：`https://cdn.voice-clone.org/logo.png`

3. **测试网站功能**
   - 启动开发服务器：`pnpm dev`
   - 检查所有图片是否正常加载
   - 验证favicon是否显示正确

## 🔄 环境切换机制

### 开发环境
- 默认使用本地资源（`/public/`目录）
- 便于开发和调试

### 生产环境  
- 自动使用CDN资源（`https://cdn.voice-clone.org/`）
- 提供更快的加载速度

### 手动控制
```typescript
// 强制使用CDN
const logoUrl = getAssetUrl('logoLight', true);

// 强制使用本地资源
const logoUrl = getAssetUrl('logoLight', false);
```

## 🎯 性能优化效果

### 预期改进
- ⚡ **加载速度提升**: CDN边缘节点就近服务
- 🌍 **全球访问优化**: Cloudflare全球网络
- 📱 **移动端优化**: 更快的图片加载
- 🔄 **缓存优化**: 长期缓存策略（1年）

### 监控指标
- 图片加载时间
- 首屏渲染时间
- 用户体验评分

## 🛠️ 故障排除

### 常见问题

1. **图片无法加载**
   - 检查CDN域名DNS配置
   - 验证R2存储桶权限
   - 确认文件已正确上传

2. **开发环境问题**
   - 确保本地public目录仍有原始文件
   - 检查CDN_CONFIG.enabled设置

3. **缓存问题**
   - 清除浏览器缓存
   - 检查Service Worker缓存

### 回滚方案

如需回滚到本地资源：

```typescript
// 在 src/config/cdn-config.ts 中
export const CDN_CONFIG = {
  enabled: false, // 设置为false
  baseUrl: CDN_BASE_URL,
  fallbackToLocal: true,
} as const;
```

## 📈 下一步优化

1. **图片格式优化**: 考虑WebP/AVIF格式
2. **响应式图片**: 不同尺寸的图片版本
3. **懒加载**: 进一步优化加载性能
4. **监控集成**: 添加CDN性能监控

## ✅ 验证清单

- [ ] 环境变量配置正确
- [ ] 静态资源已上传到R2
- [ ] CDN域名解析正常
- [ ] 网站图片正常显示
- [ ] Favicon显示正确
- [ ] Service Worker缓存更新
- [ ] 移动端测试通过
- [ ] 性能测试完成

完成以上步骤后，您的静态资源将通过Cloudflare R2 CDN进行加速，显著提升网站的加载性能！
