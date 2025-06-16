# MkSaaS

Make AI SaaS in a weekend.

The complete Next.js boilerplate for building profitable SaaS, with auth, payments, i18n, newsletter, dashboard, blog, docs, blocks, themes, SEO and more.

## Author

This project is created by [Fox](https://x.com/indie_maker_fox), the founder of [MkSaaS](https://mksaas.com) and [Mkdirs](https://mkdirs.com). The official X account for [MkSaaS](https://mksaas.com) is [@mksaascom](https://x.com/mksaascom), you can follow this account for the updates about MkSaaS.

## Documentation

The documentation is available on the [website](https://mksaas.com/docs). It includes guides, tutorials, and detailed explanations of the code. I designed it to be as beginner-friendly as possible, so you can start making money from day one.

If you found anything that could be improved, please let me know.

## Links

- 🔥 website: [mksaas.com](https://mksaas.com)
- 🌐 demo: [demo.mksaas.com](https://demo.mksaas.com)
- 📚 documentation: [mksaas.com/docs](https://mksaas.com/docs)
- 🗓️ roadmap: [mksaas roadmap](https://mksaas.link/roadmap)
- 👨‍💻 discord: [mksaas.link/discord](https://mksaas.link/discord)
- 📹 video (WIP): [mksaas.link/youtube](https://mksaas.link/youtube)

## Repositories

By default, you should have access to all four repositories. If you find that you're unable to access any of them, please don't hesitate to reach out to me, and I'll assist you in resolving the issue.

- [mksaas-template (ready)](https://github.com/MkSaaSHQ/mksaas-template): https://demo.mksaas.com
- [mksaas-blog (ready)](https://github.com/MkSaaSHQ/mksaas-blog): https://mksaas.me
- [mksaas-haitang (ready)](https://github.com/MkSaaSHQ/mksaas-haitang): https://haitang.app
- [mksaas-app (WIP)](https://github.com/MkSaaSHQ/mksaas-app): https://mksaas.app

## Notice

> If you have any questions, please [submit an issue](https://github.com/MkSaaSHQ/mksaas-template/issues/new), or contact me at [support@mksaas.com](mailto:support@mksaas.com).

> If you want to receive notifications whenever code changes, please click `Watch` button in the top right.

> When submitting any content to the issues or discussions of the repository, please use **English** as the main Language, so that everyone can read it and help you, thank you for your supports.

## License

For any details on the license, please refer to the [License](LICENSE) file.

# Feature Toggle Control System

## Implementation (2025-06-16)

### 1. Configuration-Based Feature Control
- ✅ Added `enableDocsPage` feature toggle in `src/config/website.tsx`
- ✅ Extended `FeaturesConfig` type definition in `src/types/index.d.ts`
- ✅ Set docs page to disabled by default (`enableDocsPage: false`)

### 2. Route-Level Control
- ✅ Implemented `notFound()` check in `src/app/[locale]/docs/layout.tsx`
- ✅ Docs pages return standard 404 when feature is disabled
- ✅ SEO-friendly approach - pages truly "don't exist" when disabled

### 3. Navigation Control
- ✅ Modified `src/config/navbar-config.tsx` for conditional docs link display
- ✅ Modified `src/config/footer-config.tsx` for conditional docs link in footer
- ✅ Links only appear when `enableDocsPage: true`

### 4. SEO and Sitemap Control
- ✅ Updated `src/app/sitemap.ts` with dynamic route generation
- ✅ Docs pages excluded from sitemap when feature is disabled
- ✅ Search engines won't discover disabled pages

### 5. Technical Implementation
- **Dual Control Strategy**: Route-level blocking + Link-level hiding
- **Zero Code Deletion**: All page files remain intact
- **Configuration Driven**: Single toggle controls entire feature
- **SEO Optimized**: No 404 errors affecting search rankings

### 6. Current Status
- 🔒 **Docs Feature**: DISABLED (`enableDocsPage: false`)
  - ❌ Navigation links hidden
  - ❌ Footer links hidden  
  - ❌ Direct access returns 404
  - ❌ Excluded from sitemap
  - ✅ Code files preserved

### 7. Usage
To enable docs feature:
```typescript
// src/config/website.tsx
features: {
  enableDocsPage: true,  // Enable docs functionality
}
```

To disable docs feature:
```typescript
// src/config/website.tsx
features: {
  enableDocsPage: false, // Disable docs functionality
}
```

This system can be extended to control any page or feature in the template while maintaining code integrity and providing excellent SEO performance.

# Creem Payment Integration Updates

## Recent Fixes (2025-06-14)

### 1. Customer Portal Implementation
- ✅ Fixed Creem customer portal API response parsing
- ✅ Changed from `data.url` to `data.customer_portal_link` to match Creem API
- ✅ Enhanced debugging for portal creation process

### 2. Webhook Processing Improvements  
- ✅ Added comprehensive webhook debugging
- ✅ Enhanced signature verification with detailed logging
- ✅ Added handling for empty webhook bodies (common with ngrok/proxy setups)
- ✅ Improved error categorization and logging

### 3. Technical Details
- **Customer Portal**: Creem API returns `{"customer_portal_link": "https://..."}` format
- **Webhook Signatures**: Using `creem-signature` header with HMAC-SHA256 verification
- **Empty Body Handling**: Gracefully skip processing empty webhook requests (test/proxy requests)

### 4. Known Issues Resolved
- ❌ ~~Customer portal returning empty URL~~ → ✅ Fixed API response parsing
- ❌ ~~Webhook signature verification failures~~ → ✅ Added empty body detection
- ❌ ~~Frontend compatibility issues~~ → ✅ Maintained backward compatibility

## Development Notes
- All webhook events are properly logged with detailed debugging information
- Signature verification includes comprehensive error reporting
- Empty webhook bodies are handled gracefully to prevent false errors
