# fake-gcs-client

A web UI for [fake-gcs-server](https://github.com/fsouza/fake-gcs-server). Browse buckets, view objects, upload/download files, and manage your local GCS emulator — without `curl`.

## Features

- Browse buckets and objects with folder-like navigation
- Upload and download files
- Preview images, text, JSON, and PDFs
- View object metadata (size, content type, checksums, etc.)
- Create and delete buckets
- Delete objects

## Quick Start

### With Docker Compose (recommended)

```bash
docker compose up
```

This starts both `fake-gcs-server` on port 4443 and `fake-gcs-client` on port 4442.

Open [http://localhost:4442](http://localhost:4442).

### Development

Prerequisites: [Bun](https://bun.sh/)

```bash
# Install dependencies
bun install

# Start dev server (assumes fake-gcs-server is running on localhost:4443)
bun dev
```

Open [http://localhost:4442](http://localhost:4442).

## Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `GCS_ENDPOINT` | `http://localhost:4443` | fake-gcs-server URL |

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [Bun](https://bun.sh/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Biome](https://biomejs.dev/) (linter/formatter)
- [Zod](https://zod.dev/) (validation)
- TypeScript (strict)

## License

[MIT](LICENSE)
