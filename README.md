# Ferramentas AVEX — WhatsApp Flows

Este repositório guarda uma cópia de referência do exemplo oficial **Personalised Offer** do projeto [WhatsApp/WhatsApp-Flows-Tools](https://github.com/WhatsApp/WhatsApp-Flows-Tools).

## Origem

- Repositório oficial: https://github.com/WhatsApp/WhatsApp-Flows-Tools
- Exemplo: `examples/endpoint/nodejs/personalised-offer`
- Documentação: https://developers.facebook.com/docs/whatsapp/flows/gettingstarted/personalised-offer

## Conteúdo

O diretório `whatsapp-flows/personalised-offer` contém um endpoint Node.js/Express com:

- descriptografia das solicitações recebidas;
- criptografia das respostas;
- validação opcional da assinatura da Meta;
- geração de chaves pública e privada;
- navegação entre telas do Flow;
- base para criar recomendações personalizadas.

## Aviso

O exemplo oficial é destinado a prototipação e **não está pronto para produção**. Antes de publicar, implemente validação de token, persistência, tratamento de erros, regras reais de recomendação, segurança e monitoramento.

## Licença

O código de origem está sob licença MIT, com copyright da Meta Platforms, Inc. and affiliates.