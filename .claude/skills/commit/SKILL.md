---
name: commit
description: Use this when someone asks you to create a commit in the repository.
---

## O que esta skill faz

Inclui as alterações realizadas no repositorio local, escreve uma menssagem de commit utilizando as boas praticas,
execulta o comando de commit e execulta o camnado de push para a origin da brach atual

## Passos

### Incluir as alterações

```bash
git add .
```

### Commit

```bash
git commit -m <menssagem>
```

Crie uma menssagem de commit com as alterações realizadas no repositório e rode ocomando acima com a menssagem
Utilize as boas práticas para menssagem de commit e insira no comando.

Não incluir citação ao cluade code na menssagem de commit.

### Push

```bash
git branch
```
Obter a branch atual do repositório

```bash
git push origin <nome_da_branch_atual>
```
Realizar o push para o repositorio remoto.
