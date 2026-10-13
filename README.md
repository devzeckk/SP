# SP — night

Uma vitrine musical para a seleção **night**, de **zeca**. Visual próprio inspirado em uma estante de discos, busca por música/artista e links individuais que abrem no Spotify. Responsivo, sem login, sem backend e sem dependências de instalação.

## GitHub Pages

Em **Settings → Pages**, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)** e salve. Endereço esperado: https://devzeckk.github.io/SP/.

## Músicas

`musicas.json` contém 79 faixas obtidas da versão pública incorporável do Spotify em 13/10/2026. O catálogo é independente da playlist original: ela pode ser excluída sem afetar as músicas e os links individuais do site. Não há sincronização automática. Edite esse arquivo para atualizar a seleção. Use links no formato `https://open.spotify.com/track/ID` e capas públicas HTTPS do Spotify.

Cada entrada tem `title`, `artist`, `url`, `cover`, `duration` (milissegundos) e `explicit` (booleano). A ordem das entradas define a ordem das faixas. Os quatro destaques usam as posições 4, 1, 14 e 37, definidas em `app.js`.

## Prévia e verificação

Sirva a pasta com qualquer servidor HTTP estático. Não abra `index.html` diretamente como `file://`, pois a leitura do JSON depende de HTTP. Para checar a busca e validação dos links, execute `node tests/catalog.test.cjs` nesta pasta.

Fontes: Bricolage Grotesque e DM Sans, via Google Fonts, com alternativas locais. Capas via CDN do Spotify, com ícone de reserva se uma imagem não carregar. A reprodução acontece no Spotify. Projeto pessoal sem vínculo com o Spotify.
