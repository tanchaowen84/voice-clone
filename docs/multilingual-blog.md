# 简化的多语言博客实现

本文档说明了项目中简化的多语言博客功能实现方式。

## 概述

多语言博客功能允许博客文章、分类和作者在不同语言中可用，同时使用相同的 slug 来标识相同的内容。

## 关键概念

### 1. 内容组织

内容按语言特定的目录组织：

```
content/
  ├── en/
  │   ├── blog/
  │   ├── category/
  │   └── author/
  └── zh/
      ├── blog/
      ├── category/
      └── author/
```

### 2. 统一 Slug

每个内容项（文章、分类、作者）在所有语言中使用相同的 slug：

- 英文分类：`slug: "news"`
- 中文分类：`slug: "news"`（而不是 "xinwen"）

这样可以简化内容关系的处理，不需要额外的映射机制。

## 实现细节

### Content Collections 配置

Content Collections 在 `content-collections.ts` 中配置，包括：

1. 简单的 schema 定义，包含 `slug` 和 `locale` 字段
2. Transform 函数，用于：
   - 从文件路径确定 locale
   - 处理内容之间的关系

### 内容关系

当博客文章引用分类或作者时：

1. 首先尝试查找具有相同 locale 的匹配项
2. 如果找不到，则回退到匹配 slug
3. 这确保了跨语言的关系正确工作

### 语言切换

使用现有的全局语言选择器来切换语言，无需在博客页面上添加额外的语言切换器。

## 添加新内容

添加新的多语言内容时：

1. 在每个语言目录中创建内容
2. 在所有语言中使用相同的 slug

示例（分类）：

```mdx
// content/en/category/news.mdx
---
slug: "news"
name: "News"
description: "Latest news and updates"
---

// content/zh/category/news.mdx
---
slug: "news"
name: "新闻"
description: "最新新闻和更新"
---
```

## 最佳实践

1. 在所有语言中保持 slug 一致
2. 确保每个语言的内容都有正确的 locale 属性
3. 测试不同语言之间的内容关系是否正确