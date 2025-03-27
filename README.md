# Nuxt Alcohol project

<p align="left"><a href="https://nuxt.com/" target="_blank"><img src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/NuxtJS-Dark.svg" alt="NuxtJS" width="60" height="60" /></a><a href="https://fr.vuejs.org/" target="_blank"><img src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/VueJS-Dark.svg" alt="VueJS" width="60" height="60" /></a><a href="https://www.typescriptlang.org/" target="_blank"><img src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/TypeScript.svg" alt="TypeScript" height="60" /></a><a href="https://graphql.org" target="_blank"><img src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/GraphQL-Dark.svg" alt="Graphql" height="60" /></a><a href="https://eslint.org/" target="_blank"><img src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/Eslint-Dark.svg" alt="eslint" width="60" height="60"/></a><a href="https://developers.cloudflare.com/learning-paths/get-started/" target="_blank"><img src="https://github.com/jpb06/jpb06/raw/master/icons/Cloudflare-Dark.svg" alt="Cloudflare" width="60" height="60"/></a></p>

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Setting up DNS and Cloudflare Integration

<a href="https://developers.cloudflare.com/learning-paths/get-started/" target="_blank"><img src="https://github.com/jpb06/jpb06/raw/master/icons/Cloudflare-Dark.svg" alt="Cloudflare" width="120" height="120"/></a>

This guide explains how to configure your domain to work with Cloudflare, ensuring proper DNS settings and redirects.

---

## In OVH

### Step 1: Remove DNS Records

1. Go to **"Zone DNS"** in your OVH dashboard.
2. Delete the following A records:
   ```
   .example.fr.
   0   A   213.186.33.5

   www.example.fr.
   0   A   213.186.33.5
   ```
3. Also, remove the TXT records:
   ```
   IN TXT    "1|www.example.fr"
   www        IN TXT    "3|welcome"
   ```

### Step 2: Change Nameservers

1. Go to **"Serveurs DNS"** in your OVH dashboard (not **"Zone DNS"**).
2. Replace the current nameservers with Cloudflare's:
   - `nova.ns.cloudflare.com`
   - `yahir.ns.cloudflare.com`

---

## In Cloudflare

### Step 1: Add Custom Domains

1. Go to **Cloudflare Pages** → Your project → **Custom Domains**.
2. Add both `example.fr` and `www.example.fr` as custom domains.

### Step 2: Configure DNS Records

1. In the **DNS** tab, go to **"Records"**.
2. The following CNAME records should be:
   ```
   CNAME   example.fr   nuxt-alcohol.pages.dev   Proxied   Auto
   CNAME   www          nuxt-alcohol.pages.dev   Proxied   Auto
   ```
3. Remove any old OVH records, such as:
   ```
   A : www : 213.186.33.5
   ```

### Step 3: Set Up Page Rule for Redirection

1. In **"Rules"** → **"Page Rules"**, click **"Create a Page Rule"**.
2. Add a rule with the following details:
   - **URL required**: `www.example.fr/*`
   - **Forwarding URL**: Select **301 - Permanent Redirect**
   - **Destination**: `https://example.fr/$1`
3. Click **"Save and Deploy Page Rule"**.

---

Now your domain is properly configured to use Cloudflare and redirect traffic from `www.example.fr` to `example.fr`.
