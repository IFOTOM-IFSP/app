# Como Rodar o Projeto

## 1. Pré-requisitos

- **Node.js** versão 20.x ou superior ([Download Node.js](https://nodejs.org/))
- **npm** versão 10.x ou superior (instalado junto com o Node.js)
- **Expo CLI** (global):
  ```bash
  npm install -g expo-cli
  ```
- **Git** ([Download Git](https://git-scm.com/))

## 2. Instalação e Setup

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <PASTA_DO_PROJETO>
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configuração inicial:**
   - Caso existam variáveis de ambiente ou arquivos de configuração, crie um arquivo `.env` seguindo o exemplo de `.env.example` (se houver).
   - Por padrão, não há configuração extra obrigatória para rodar o projeto.

## 3. Como Rodar o Projeto

- **Inicie o servidor de desenvolvimento (Expo):**
  ```bash
  npm start
  ```
  Isso abrirá o Expo DevTools no navegador.

- **Para rodar em diferentes plataformas:**
  - **Web:**
    ```bash
    npm run web
    ```
    Acesse: [http://localhost:19006](http://localhost:19006)
  - **Android:**
    ```bash
    npm run android
    ```
  - **iOS:**
    ```bash
    npm run ios
    ```

## 4. Considerações Adicionais

- **Lint:**
  ```bash
  npm run lint
  ```
- **Resetar o projeto:**
  ```bash
  npm run reset-project
  ```
- **Build para produção:**
  Consulte a [documentação do Expo](https://docs.expo.dev/classic/building-standalone-apps/) para gerar builds para Android/iOS.

## 5. Links Úteis
- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do React Native](https://reactnative.dev/)
- [Documentação do Node.js](https://nodejs.org/)

---

Se encontrar algum problema, consulte a documentação acima ou abra uma issue.
