# klima-front
Aplicación frontend para consultar la previsión climatológica

## Ejecutar aplicación en local
Prerrequisitos:
- Tener instalado Docker Desktop (versión superior a la 4.37.1): https://docs.docker.com/
- Tener levantado el contenedor de la aplicación klima-back (leer README en https://github.com/yasinmunoz/klima-back)

Pasos
- Ejecutar en terminal el siguiente comando para descargar la imagen de la aplicación klima-front:
```bash
docker pull yasinmunoz/klima-front
``` 
- Puedes consultar el repositorio de la imagen alojado en Docker Hub en esta dirección: https://hub.docker.com/r/yasinmunoz/klima-front
- Ejecutar en terminal el siguiente comando para levantar un contenedor con la imagen descargada:
```bash
docker run -d --name klima-front -p 4200:4200 yasinmunoz/klima-front:latest
```
- La aplicación estará levantada en el puerto 4200 de tu localhost. 
- Abre tu navegador y ve a la dirección http://localhost:4200
