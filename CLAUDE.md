# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a TypeScript monorepo for **HTTP Service** - a unified HTTP request library for browser and server environments. Uses pnpm workspaces with the following key packages:

- `packages/http-svc/` - Main HTTP service library
- `packages/middleware/` - Base middleware interfaces  
- `packages/server-fetch/` - Server-side fetch implementation
- `packages/xhr/` - XHR-based middleware
- `docs/` - VitePress documentation
- `server/` - Test server (Koa-based)

## Development Commands

### Interactive Development

- `pnpm start` - Interactive package selector for running dev scripts
- `pnpm dev` - Run development server for selected package
- `pnpm build` - Build selected package

### Core Package (http-svc)

- `pnpm test` - Run Jest tests
- `pnpm build` - Dual build (modern ES2018+ and legacy ES2015+)
- `pnpm build:modern` - Modern ES build only
- `pnpm build:legacy` - Legacy ES2015 build only

### Documentation

- `pnpm docs:dev` - Start VitePress development server
- `pnpm docs:build` - Build documentation site

### Package Management

- `pnpm create` - Create new packages
- `pnpm pub` - Interactive publishing workflow

## Architecture

The HTTP Service follows a **middleware-based request pipeline** pattern similar to Koa.js:

### Core Components

- **HttpService** (`/packages/http-svc/src/core.ts`) - Main service class with three control units:
  - `AssembleControl` - Middleware assembly and dispatch
  - `ConfigControl` - Per-request configuration context  
  - `RequestControl` - Request execution management

### Built-in Middleware Stack

Located in `/packages/http-svc/src/built-in/`:

- `HttpSvcFetch` - Core fetch implementation
- `HttpSvcSpray` - Request optimization
- `HttpSvcRetry` - Retry logic
- `HttpSvcCache` - Caching mechanism
- `HttpSvcXsrf` - CSRF protection
- Plus utility middlewares for timeout, body processing, logging

### Key Features

- Fetch API-based core with fallback to XHR
- Dual environment support (browser/Node.js)
- TypeScript-first with comprehensive type definitions
- Extensible middleware system
- Dual module builds (ESM/CJS)

## Build System

- **Build Tool**: Vite with dual-target configuration
- **Output**: Modern (.mjs) and legacy (.cjs) builds for maximum compatibility
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Module Formats**: Both ESM and CommonJS supported

## Testing

- **Framework**: Jest with ts-jest preset
- **Location**: `/packages/http-svc/src/__tests__/`
- **Pattern**: `**/*.spec.ts`
- Run tests with `pnpm test` in the http-svc package

## Code Quality

- **ESLint**: TypeScript configuration with Prettier integration
- **Line Length**: 140 characters maximum
- **Formatting**: Prettier for consistent code style
