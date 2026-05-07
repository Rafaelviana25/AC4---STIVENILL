# GUIA DEFINITIVO: CONVERSÃO PARA ANDROID STUDIO E WIDGET FUNCIONAL

Este guia contém o passo a passo completo para converter o aplicativo AC4 STIVENILL para o Android Studio, garantindo que o widget de calendário funcione corretamente.

## PASSO 1: Preparação do Projeto Web
1. Certifique-se de que o projeto está compilado:
   `npm run build`

2. Sincronize com o Capacitor:
   `npx cap sync android`

## PASSO 2: Abrir no Android Studio
1. Abra o Android Studio.
2. Selecione "Open" e navegue até a pasta `android` do seu projeto.

## PASSO 3: Configurar os Arquivos Nativos (Widget)
Copie os arquivos da pasta `android_widget_final` para os locais correspondentes no Android Studio:

### A. Código Java (Pasta: `app/src/main/java/com/ac4stivenill/app/`)
Substitua ou adicione os seguintes arquivos:
- `MainActivity.java`
- `CalendarWidget.java`
- `CalendarWidgetService.java`
- `CalendarWidgetFactory.java`
- `WidgetBridge.java`

### B. Layouts XML (Pasta: `app/src/main/res/layout/`)
Adicione estes arquivos:
- `widget_calendar.xml`
- `widget_calendar_item.xml`
- `widget_calendar_item_today.xml`

### C. Configuração do Widget e Rede (Pasta: `app/src/main/res/xml/`)
Adicione:
- `calendar_widget_info.xml`
- `network_security_config.xml` (ESSENCIAL para corrigir o erro de conexão)

### D. Drawables (Pasta: `app/src/main/res/drawable/`)
Crie a pasta `drawable` se não existir e adicione:
- `bg_circle_black_20.xml`
- `bg_circle_lime_500.xml`

### E. Manifesto (Arquivo: `app/src/main/AndroidManifest.xml`)
Abra o arquivo `AndroidManifest_COMPLETO.xml` da pasta final e use-o como referência para atualizar o seu manifesto. Certifique-se de que:
1. A `MainActivity` tem o `android:name=".MainActivity"`.
2. O `<receiver>` do `CalendarWidget` está declarado.
3. O `<service>` do `CalendarWidgetService` está declarado com a permissão `android:permission="android.permission.BIND_REMOTEVIEWS"`.
4. A tag `<application>` contém `android:usesCleartextTraffic="true"` e `android:networkSecurityConfig="@xml/network_security_config"`.

## PASSO 4: Ajustes Finais no Android Studio
1. Vá em `File` -> `Sync Project with Gradle Files`.
2. Verifique se não há erros de compilação.
3. Se houver erro de `R.layout...`, certifique-se de que o pacote no topo dos arquivos Java é `package com.ac4stivenill.app;`.

## PASSO 5: Testar o Widget
1. Execute o aplicativo no seu celular ou emulador.
2. Faça login e adicione alguns eventos na agenda.
3. Vá para a tela inicial do Android, pressione e segure, selecione "Widgets".
4. Procure por "AC4 STIVENILL" e adicione o widget de calendário.
5. O widget deve mostrar os seus eventos sincronizados em tempo real.

---
### DICAS PARA RESOLVER PROBLEMAS:
- **"Failed to fetch":** O aplicativo agora entra em modo offline automaticamente se a conexão falhar. Se você estiver no emulador, verifique se ele tem acesso à internet.
- **Widget não aparece:** Verifique se o `AndroidManifest.xml` contém a declaração do `<receiver>`.
- **Widget não atualiza:** Verifique se a `MainActivity` está registrando o `WidgetBridge` corretamente (veja o arquivo `MainActivity.java`).
