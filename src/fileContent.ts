export const indexHtml = (projectName: string) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${projectName}</title>
    <style>
      html,
      body {
        padding: 0px;
        margin: 0px;
      }
      .container {
        width: 800px;
        height: 400px;
        background-color: #eee;
        border-radius: 20px;
        margin: 200px auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${projectName}</h1>
      Built with <a href="https://www.npmjs.com/package/raise-the-bones">raise-the-bones</a>
    </div>
  </body>
</html>
`

export const gitIgnore = () => `node_modules
`

export const serverTs = () => `import express, { Request, Response } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(dirname, './index.html'))
})

app.listen(port)
console.log(\`Server started at http://localhost:\${port}\`)
`

export const prettierrc = () => `{
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "avoid",
  "semi": false,
  "printWidth": 120
}
`

export const eslint = () => `{
  "rules": {
    "react-hooks/exhaustive-deps": "off",
    "no-loop-func": "off",
    "no-console": "off",
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/indent": "off",
    "arrow-parens": "off",
    "no-multiple-empty-lines": "off",
    "no-multi-spaces": "off",
    "no-trailing-spaces": "off",
    "implicit-arrow-linebreak": "off",
    "padded-blocks": "off"
  },
  "extends": ["airbnb", "airbnb-typescript"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "ignorePatterns": ["dist/*.js"]
}
`

export const tsConfig = () => `{
  "include": ["**/*.ts"],
  "compilerOptions": {
    "isolatedModules": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "allowJs": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "react",
    "paths": {
      "~/*": ["./src/*"]
    },
    "outDir": "dist"
  }
}
`

export const readme = (projectName: string) => `# ${projectName}

Created with raise-the-bones
[Github](https://github.com/JoeTheDave/raise-the-bones)
[npm](https://www.npmjs.com/package/raise-the-bones)

### Deployment
- fly launch (initialize a fly.io app and local config file)
- fly deploy (deploy the app to fly.io)
- fly view (open the app in the browser)

`
