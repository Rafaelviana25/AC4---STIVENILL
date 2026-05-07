# Projeto Android - Meu Calendário

Este é um projeto Android completo pronto para ser aberto no Android Studio.

## Como usar:
1. Copie todo o conteúdo desta pasta para o seu computador.
2. Abra o **Android Studio**.
3. Clique em **File > Open** e selecione a pasta que você copiou.
4. O Android Studio irá baixar as dependências e configurar o projeto automaticamente.

## O que foi corrigido:
- **Compatibilidade com Java 21:** Atualizado para Gradle 8.7 e AGP 8.2.2 para funcionar corretamente com as versões mais recentes do Android Studio que usam Java 21.
- **Login do Google:** O aplicativo agora carrega a URL pública (`Shared App URL`), que não exige login do Google para visualizar o calendário.
- **Barra de Notificações:** Adicionado `fitsSystemWindows = true` na WebView para evitar que o conteúdo fique por baixo da barra de status.
- **Widget do Calendário:** O código do Widget foi totalmente reescrito para calcular corretamente os dias do mês atual e aplicar as cores da sua agenda.
- **Sincronização:** A ponte entre o site e o Android (`WebAppInterface`) foi corrigida para garantir que os dados sejam salvos e o widget atualizado em tempo real.

## Estrutura do Projeto:
- `app/src/main/java/com/meuapp/calendario/`: Contém o código Kotlin.
- `app/src/main/res/layout/`: Contém o visual do widget.
- `app/src/main/res/xml/`: Contém a configuração do widget.
- `app/build.gradle`: Configurações de compilação e dependências.
