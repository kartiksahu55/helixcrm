# Spectical Referal Software

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express, MongoDB

## Installation

### Install Client(React) Environment

```bash
    yarn create vite
    yarn install
```

### Install Tailwind css

```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
```

Configure your template paths

```tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
    extend: {},
    },
    plugins: [],
}
```

Add the Tailwind directives to your CSS

```index.css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
```

Start your build process

```bash
    npm run dev
```

Start using Tailwind in your project

## Install Dependencies

```bash
    npm install
```

**insert below dependencies**

- react-router-dom
- react-hot-toast
- react-icons
- daisyui
- axios

### Configure auto import sort eslint (Optional)

1. Install simple import sort

```bash
    npm i -D  eslint-plugin-simple-import-sort
```

2. Add rule in `.eslint.cjs`

```bash
    'simple-import-sort/imports': 'error'
```

3. Add simple-import sort plugin in `.eslint.cjs`

```bash
    plugins: [...,"simple-import-sort"]
```

4. To enable auto import sort on file save in vscode

   - open `setting.json`
   - add the following config

```bash
    "editor.codeActionOnSave": {
        "source.fixAll.eslint": true}
```
