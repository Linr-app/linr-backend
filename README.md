# linr_backend

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
      fila: [string],
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
    fila: [string],
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

