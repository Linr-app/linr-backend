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

  * Gerar documentacao:
  ```
    yarn run docs
  ```

## API

Para fazer chamadas ao API do frontend, basta fazer o seguinte:

```js
import { api } from '../js/environment'

this.$http.get(api('/meu_endpoint')).then(response => {
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
