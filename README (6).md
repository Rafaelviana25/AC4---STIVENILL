Como usar os arquivos do Android Studio:

1. Baixe e instale o Android Studio no seu computador.
2. Abra o Android Studio e clique em "New Project" (Novo Projeto).
3. Escolha "Empty Views Activity" e clique em Next.
4. Dê um nome para o seu aplicativo e clique em Finish.
5. Quando o projeto carregar, você vai substituir os arquivos do projeto pelos arquivos que estão nesta pasta.
6. Copie os arquivos .kt (MainActivity.kt, WebAppInterface.kt, CalendarWidgetProvider.kt) para a pasta app/src/main/java/com/seu/pacote/
7. Copie o arquivo widget_calendar.xml para a pasta app/src/main/res/layout/
8. Crie uma pasta chamada "xml" dentro de app/src/main/res/ e copie o arquivo calendar_widget_info.xml para lá.
9. Substitua o conteúdo do seu AndroidManifest.xml pelo conteúdo do arquivo AndroidManifest.xml que está aqui.
10. No Android Studio, clique em "Build" > "Build Bundle(s) / APK(s)" > "Build APK(s)" para gerar o arquivo de instalação do seu aplicativo!
