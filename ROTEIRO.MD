## Próximos passos
### Backend
* Preparar o backend para interagir com o servidor e a placa, permitindo integração via API com outros sistemas
* Criar script para mocked data,
  * Deve associar o fluxo ao vivo;
  * Deve fazer upload dos conteudos ondemand
  * Fazer upload de contents
  * Criar usuários
### Frontend



### Testes
* Testar a aplicação diretamente no servidor de streaming para validar os fluxos ao vivo e compartilhamento de informaçoes
* Fazer a build do app para fazer o teste real

## Entrega
Fluxo de demonstração da entrega, com foco em sincronização inicial via servidor e compartilhamento local sem dependência de internet.

### 1. Preparação do cenário
* Realizar o deploy no servidor de streaming com a placa.
* Posicionar um notebook ao lado do servidor para simular o ambiente de gestão do professor.
* Preparar dois celulares com o aplicativo instalado e sem conteúdos sincronizados inicialmente.

### 2. Sincronização inicial com o servidor
* No celular 1, escanear o QR Code de acesso ao Wi-Fi da mesma rede do servidor de streaming.
* Após entrar na rede, o aplicativo atualiza os conteúdos, baixa os materiais on-demand e exibe o conteúdo ao vivo.
* Desconectar o celular 1 do Wi-Fi e demonstrar que os conteúdos continuam disponíveis offline.

### 3. Compartilhamento descentralizado entre celulares
* Com o celular 1 fora da rede do servidor, ativar o hotspot para que ele passe a atuar como ponto de distribuição local.
* Conectar o celular 2 ao hotspot do celular 1.
* No aplicativo do celular 1, acessar a área de compartilhamento e gerar o QR Code de transferência.

### 4. Como o QR Code funciona nesse fluxo
* O QR Code contém variáveis de configuração da origem dos conteúdos, como `SERVER_IP`.
* Na sincronização inicial, o celular 1 lê um QR Code cujo `SERVER_IP` aponta para o servidor de streaming.
* No compartilhamento local, o celular 2 lê o QR Code gerado pelo celular 1, e então interpreta o `SERVER_IP` como o endereço do próprio celular 1.
* Com isso, o celular 2 passa a baixar os conteúdos diretamente do celular 1, sem precisar acessar o servidor central.

### 5. Resultado esperado da entrega
* Validar que um dispositivo sem interação prévia com o servidor (celular 2) consegue receber os conteúdos por proximidade.
* Demonstrar o objetivo principal do projeto: distribuição de conteúdo descentralizada, com suporte a ambientes de baixa ou nenhuma conectividade.

## Fazer
Rodolfo
Melhorar o diagrama


