# Reto Chat con MongoDB

El programa corre un chat en `localhost:3000`, que carga mensaje de la base de datos de mongo en la URL `mongodb://localhost:27017`. En la URL `/chat/api/messages` del programa se pueden efectuar peticiones GET y POST. Para un cierto mensaje, dado una etiqueta de tiempo específica, se puede hacer peticiones POST, PUT y DELETE a `/chat/api/messages/:ts` para ts un número natural. Para escribir un mensaje en el chat se requiere del mensaje y el autor (la etiqueta de tiempo se asigna automáticamente). 
