# linr_backend [![Build Status](https://travis-ci.org/Linr-app/linr-backend.svg?branch=master)](https://travis-ci.org/Linr-app/linr-backend)

## Como rodar

1. Clonar o repositorio

```
git clone https://github.com/Linr-app/linr-backend/
```

2. Inicializar as dependencias

```
yarn
```

3. Rodar:
  * Modo de Desenvolvimento:
  ```
    yarn run start
  ```

  * Modo de Producao:
  ```
    yarn run production
  ```

  * Testes:
  ```
    yarn run test
  ```

## API

Para fazer chamadas ao API do frontend, basta fazer o seguinte:

```js
this.$http.get('/api/meu_endpoint').then(response => {
  // fazer o que precisa com o retorno
})
```

Mais documentação de como usar isso: https://github.com/axios/axios

O API sempre retorna no formato

```json
{
  status: 'ok' | 'error',
  data: json_object,
}
```

ou seja, o status diz se a chamada foi bem sucedida. Se sim, o campo `data` terá
or objetos descritos a seguir.

1. GET    /restaurante

  Retorna todos os objetos Restaurante:
  ```json
  [
    {
      id: string,
      nome: string,
      endereco: string,
      descricao: string,
      site: string,
      telefone :string,
      hora_funcionamento_inicio: string,
      hora_funcionamento_fim: string,
      forma_pagamento: string,
      informacao_adicional: string,
      filas: [string],
    },
    ...
  ]
  ```
2. GET    /restaurante/:id

  Retorna um unico objeto Restaurante:
  ```json
  {
    id: string,
    nome: string,
    endereco: string,
    descricao: string,
    site: string,
    telefone :string,
    hora_funcionamento_inicio: string,
    hora_funcionamento_fim: string,
    forma_pagamento: string,
    informacao_adicional: string,
    filas: [string],
  }
  ```
3. POST   /restaurante

  Adiciona um restaurante novo. Campos necessários para a inserção:
  ```json
  {
    id: string,
    nome: string,
    endereco: string,
    descricao: string,
    site: string,
    telefone :string,
  }
  ```

4. GET    /fila

  Retorna todas as filas em uma lista.

5. GET    /fila/:id

  Retorna a fila com o id especificado

6. POST   /fila

  Adiciona uma nova fila. Campos necessários para a inserção:
  ```json
  {
    id: integer,
    id_restaurante: integer,
    hora_funcionamento_inicio: string,
    hora_funcionamento_fim: string,
    tempo_medio_inicial: integer,
  }
  ```

7. PUT    /fila/:id

  Edita uma fila existente. Campos possíveis de alteração:
  ```json
  {
    hora_funcionamento_inicio: string,
    hora_funcionamento_fim: string,
    tempo_medio_inicial: integer,
  }
  ```

8. PUT    /fila/:id/enter

  Adiciona um novo usuario na fila :id. Campos necessários para inserção:
  ```json
  {
    id_usuario: integer,
    qtd_pessoas: integer,
  }
  ```
  em que `ìd_usuario` é o ID do usuário a ser inserido.
