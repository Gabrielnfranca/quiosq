# QuiosQ - Sistema de Gerenciamento

Bem-vindo ao repositório unificado do sistema QuiosQ.

## 📂 Estrutura do Projeto

*   **quiosq-back-master/**: API Backend (Spring Boot / Java 17).
*   **quiosque_angular_adm-dev/**: Painel Administrativo Frontend (Angular 17+ / PrimeNG).
*   **quiosque_node-main/**: Serviço Node (Auxiliar).
*   **docker-compose.yml**: Orquestrador de contêineres e infraestrutura (ex: PostgreSQL).
*   **scripts_historico/**: Arquivos temporários e scripts de manutenção armazenados para backup.
*   **z_backups_zip/**: Cópias originais compactadas do projeto.

## 🚀 Como Iniciar

1. Suba o banco de dados via Docker: docker-compose up -d
2. Inicie a API Spring Boot.
3. Inicie a aplicação Angular.
