# SupJirallo
Projet WEB using MEAN stack (Mongo, Express, Angular, Node)

This School Project aim to create an agile board like Trello or Jira.
It must be done using MEAN Stack even if MongoDB is not the most optimize databases for this (NoSql database to manage a relationnal database ~~ )

## HOW TO - Run for dev aims : 

- **Make sure you have installed docker and docker-compose**
- **The Makefile file should be adapted for Mac and Windows user**
- Clone the project and move into it `git clone https://github.com/titouanfreville/SupJirallo && cd SupJirallo`
- Run the project using `make` (unix :p ) or `docker-compose build && docker-compose up` if you are working from a docker machine (mac && windows)

## HOW TO - Run for prod :
- **Make sure you have installed docker and docker-compose**
- **The Makefile file should be adapted for Mac and Windows user**
- Clone the project and move into it `git clone https://github.com/titouanfreville/SupJirallo && cd SupJirallo`
- Run the project using `make start_prod` (unix :p ) or `docker-compose -f docker-compose.prod.yml build && docker-compose docker-compose.prod.yml up` if you are working from a docker machine (mac && windows)
