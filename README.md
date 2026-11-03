# Arqchives

Organize projetos musicais, lançamentos, arquivos e versões de áudio em um só lugar. O Arqchives é um aplicativo desktop para Windows, feito com Electron e React, que ajuda a manter o trabalho de cada artista organizado em um workspace local.

<p align="center">
  <img src="./public/icon.png" alt="Ícone do Arqchives" width="112">
</p>

## Recursos

- **Projetos e workspaces:** crie projetos e organize os arquivos em uma estrutura de pastas própria. Uma estrutura inicial opcional inclui `albums`, `singles`, `eps`, `references`, `contracts`, `press`, `social` e `material`.
- **Álbuns e faixas:** registre lançamentos, faixas, BPM, tonalidade, status, notas e tarefas.
- **Versões de áudio:** mantenha versões como rascunho, mix, master, instrumental e acapella.
- **Player integrado:** ouça faixas e filas de reprodução, navegue pela timeline e veja a forma de onda; há também controles de volume, repetição e reprodução aleatória.
- **Organização de arquivos:** classifique arquivos por tipo e configure quais categorias são aceitas em cada pasta.
- **Capas e materiais:** associe artes, referências e outros arquivos aos projetos e lançamentos.
- **Backup e restauração:** exporte ou restaure configurações e dados do workspace.

## Baixar

O Arqchives é empacotado como um executável portátil para **Windows x64**. Quando houver uma versão publicada, ela estará na página de [Releases](https://github.com/crawzler/Arqchives/releases).

O executável portátil não requer uma instalação tradicional. Os dados e as mídias do usuário permanecem nos locais escolhidos no computador e não são incorporados ao executável.

> **Aviso:** os executáveis atuais não são assinados digitalmente. O Windows pode exibir um aviso de segurança ao abri-los.

## Executar em desenvolvimento

### Requisitos

- Windows com Node.js e npm instalados.
- Git para clonar o repositório.

### Preparar e iniciar

```powershell
git clone https://github.com/crawzler/Arqchives.git
cd Arqchives
npm install
npm run dev
```

O comando de desenvolvimento inicia o Vite e o Electron.

## Compilar

Para gerar os arquivos da aplicação:

```powershell
npm run build
```

Para empacotar a versão portátil para Windows x64:

```powershell
npm run package
```

O executável é criado em `build-output/`. Essa pasta é saída de build e não deve ser enviada como parte do código-fonte.

Se o empacotamento falhar no Windows ao extrair links simbólicos do utilitário `winCodeSign` por falta de permissão, é possível gerar o pacote sem editar os recursos do executável:

```powershell
npx electron-builder --win portable --x64 --config.win.signAndEditExecutable=false
```

Essa alternativa não assina o executável e pode não aplicar todos os metadados visuais do `.exe`.

## Organização e dados

O workspace é selecionado ou criado pelo usuário. A estrutura padrão de pastas é opcional e pode ser ajustada às necessidades do projeto. Arquivos de áudio permanecem nos caminhos locais registrados pelo app; mover ou renomear esses arquivos fora do Arqchives pode exigir atualizar as referências ou executar a sincronização do projeto.

Faça backups regulares dos projetos e das mídias originais. O backup do app não substitui uma cópia independente dos arquivos importantes.

## Tecnologias

- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/) e [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/)

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o app em desenvolvimento. |
| `npm run build` | Compila o Electron e a interface web. |
| `npm run build:electron` | Compila os processos principal e preload do Electron. |
| `npm run package` | Gera o pacote portátil para Windows. |
| `npm run preview` | Inicia uma prévia local da build web. |
| `npm run lint` | Executa o ESLint; a ferramenta e a configuração precisam estar disponíveis no ambiente. |

## Contribuições

Issues e pull requests são bem-vindos. Para mudanças maiores, abra uma issue primeiro para discutir o escopo.

## Estado do projeto

O build de produção e o empacotamento para Windows x64 estão configurados. O projeto ainda não inclui uma suíte de testes automatizados nem configuração de ESLint versionada.

## Licença

Este repositório ainda não inclui um arquivo de licença. Até que uma licença seja definida, não presuma que o código pode ser redistribuído ou reutilizado.
