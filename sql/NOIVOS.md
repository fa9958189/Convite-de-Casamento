# Ativar a área privada

1. No projeto `pmlymwlwtmpliakmnpig`, abra **Authentication > Users**. Verifique se a conta específica já existe; caso não exista, crie-a com e-mail real controlado pelos noivos e senha definida pelo proprietário, respeitando a política atual. Não use cadastro público nem altere regras globais.
2. Copie o UUID dessa conta. Substitua todas as ocorrências de `UUID_DA_CONTA_DOS_NOIVOS` em `sql/noivos_acesso.sql`.
3. Execute apenas esse SQL em **SQL Editor > New query > Run**. Ele não recria a tabela nem modifica registros e preserva o INSERT anon.
4. Configure `VITE_NOIVOS_EMAIL` em `.env.local` e no Vercel (Production e Preview). Nunca coloque a senha em variáveis VITE, código ou Git. Gere um novo deploy após definir o e-mail.
5. Entre em `/noivos` usando `noivos` e a senha da conta. A autorização real vem do UUID no banco, não do nome visual ou do e-mail no frontend.

A função `noivos_autorizado` retorna somente um booleano, permitindo distinguir tabela vazia de leitura negada por RLS. Não basta executar só a política: execute o arquivo completo.

Validar após ativar: conta dos noivos consegue contar e paginar; outra conta recebe autorização falsa e nenhum registro/contagem; anon não consegue ler; UPDATE/DELETE são negados; confirmação pública continua anon mesmo com sessão dos noivos. Não publique credenciais nem libere SELECT para fazer testes.
