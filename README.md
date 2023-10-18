<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Teslo API

1. Clonar proyecto
2. ```yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos
```
docker-compose up -d
```
-. primero levantar todo, de ahi hacer el seed, luego de eso loguerase 
6. Ejecutar SEED 
```
http://localhost:3000/api/seed
```

7. Levantar: ```yarn start:dev```

9. generar token para loguear al usuario
```
http://localhost:3000/api/auth/login
```
10. crear usuario 
```
http://localhost:3000/api/auth/register
{
    "email": "j21@gmail.com",
    "password": "Asd123123123",
    "fullName":"jeferson"
}
```
11. documentacion de los enpoint de postman
```
https://documenter.getpostman.com/view/22139257/2s9YR9YCRa
```
12. documentacion con swagger
y si ingresamos al url

http://localhost:3000/api
no va hacer ver la documentacion de los empoints
```
http://localhost:3000/api/auth/login
```