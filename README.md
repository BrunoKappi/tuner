# 🎸 GuitarTune - Afinador Cromático Online de Alta Precisão

**GuitarTune** é uma aplicação web moderna de alto desempenho focada exclusivamente na afinação rápida e intuitiva de instrumentos de corda, com suporte otimizado para **Violão**, **Guitarra** e **Baixo**.

O projeto funciona **100% no navegador**, executado inteiramente de forma local (offline) no dispositivo do usuário, sem necessidade de instalações, cadastro ou envio de dados de áudio para servidores externos.

---

## ✨ Características Principais

*   **100% Client-Side:** Captura do sinal do microfone local e processamento digital de áudio totalmente no navegador usando a **Web Audio API**.
*   **Privacidade Total:** Zero dados de áudio armazenados ou enviados para servidores externos.
*   **Detecção Cromática Avançada:** Identifica de forma precisa qualquer uma das 12 notas musicais da escala cromática e sua oitava correspondente (de C0 a B8).
*   **Estabilidade de Ponteiro (DSP Engineering):** Ponteiro analógico graduado que desliza com física real de amortecimento, evitando oscilações abruptas.
*   **Filtro por Moda Estatística:** Implementa um algoritmo que bloqueia notas instáveis analisando o histórico recente de detecção, estabilizando a nota exibida e a oitava.
*   **Indicador de Nível de Entrada (RMS):** Classifica visualmente a intensidade sonora detectada em "Sem sinal", "Sinal fraco" e "Bom sinal".
*   **Seletor de Instrumentos Reativo:** Perfis pré-definidos para Violão, Guitarra e Baixo, com destaque visual indicando qual corda física está próxima da nota tocada.
*   **Design Premium Minimalista:** Tema escuro nativo no estilo Glassmorphism, com micro-animações, micro-transições fluidas a 60 FPS e suporte internacional completo (i18n).

---

## 🛠️ Stack Tecnológica

*   **Core:** React 19, TypeScript, Vite
*   **Gerenciamento de Estado:** Redux Toolkit (para configurações estruturais) e React State (para processamento de fluxo a 60 FPS)
*   **Estilização:** Tailwind CSS v3 e PostCSS (com fontes Inter e Outfit)
*   **Algoritmo de Frequência:** Pitchy (biblioteca otimizada de detecção de pitch via FFT)
*   **Internacionalização:** i18next e react-i18next (suporte total a Inglês e Português do Brasil de forma 100% offline)
*   **Iconografia:** Lucide React

---

## 🧠 Arquitetura Técnica e Engenharia de Sinais

Para solucionar a sensibilidade excessiva e variações abruptas de frequência (comuns em transientes de cordas ou harmônicos secundários), o afinador conta com três mecanismos de processamento digital no cliente:

1.  **Gate de Amplitude RMS (Root Mean Square):**
    Calcula a energia real do buffer de áudio capturado e impede a análise de ruídos insignificantes do ambiente.
2.  **Média Móvel Exponencial (EMA - Exponential Moving Average):**
    Aplica um filtro passa-baixas de frequência com coeficiente $\alpha = 0.08$ para amortecer a agulha virtual de cents. Se houver uma variação maior que $5\%$ (representando uma real mudança de nota), o filtro é reiniciado instantaneamente para manter o afinador extremamente responsivo.
3.  **Filtragem por Moda Estatística:**
    Mantém as últimas 9 leituras de notas em um buffer circular e exibe a **Moda** (a nota com maior contagem no histórico). Isso descarta completamente picos transientes ou harmônicos instáveis.

---

## 📂 Estrutura de Pastas

A aplicação segue uma arquitetura modular inspirada em **Domain-Driven Design (DDD)**:

```txt
src/
├── core/
│   ├── store/
│   │   └── Store.ts               # Redux Store global
│   └── i18n/
│       └── i18n.ts                # Inicialização i18next offline
├── modules/
│   └── Tuner/
│       ├── components/
│       │   ├── Tuner.Card.tsx               # Contêiner central e visualizador
│       │   ├── Tuner.Meter.tsx              # Régua analógica SVG graduada
│       │   ├── Tuner.InstrumentSelector.tsx # Seletor de instrumentos
│       │   ├── Tuner.StatusDisplay.tsx      # Nota, oitava, corda e frequências
│       │   ├── Tuner.Controls.tsx           # Botões silenciar/reiniciar
│       │   └── Tuner.QuickInstructions.tsx  # Manual e guia rápido de uso
│       ├── hooks/
│       │   └── Tuner.Hook.ts                # Custom Hook reativo de áudio
│       ├── services/
│       │   └── Tuner.AudioProcessor.ts      # Motor Web Audio API + Pitchy
│       ├── store/
│       │   └── Tuner.Slice.ts               # Estado e preferências no Redux
│       ├── types/
│       │   └── Tuner.Types.ts               # Interfaces TypeScript de domínio
│       ├── constants/
│       │   └── Tuner.Constants.ts           # Definições físicas das afinações e limiares
│       └── translations/
│           ├── pt-BR.json                   # Traduções em Português
│           └── en.json                      # Traduções em Inglês
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** instalado em seu sistema (v18 ou superior recomendado).

1.  **Clone o repositório:**
    ```bash
    git clone git@github.com:BrunoKappi/Tuner.git
    cd Tuner
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Acesse o link local (ex: `http://localhost:5173`) exibido no terminal.

4.  **Para compilar a versão otimizada de produção:**
    ```bash
    npm run build
    ```
