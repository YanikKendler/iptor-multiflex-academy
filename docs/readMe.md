# How to run

## Database

Run these in any Terminal and make sure docker is running:

Pull the postgres container `docker pull postgres`

Run the postgres container with appropriate port and password 
`docker run --name postgres-container -e POSTGRES_PASSWORD=postgresdb -p 5432:5432 -v postgres-data:/var/lib/postgresql/data -d postgres`

Enter the postgres dp to execute commands inside it `docker exec -it postgres-container psql -U postgres`

`create database multiflex;`

`create user multiflex_academy with password 'R0LvkvdE5gu41s8&@x07JZ@6O29@@^';`

`alter user multiflex_academy with superuser;`