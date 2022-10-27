const fs= require('fs');

const express = require('express');
const aplicacion = express();
const port = 8080;


class Contenedor {
    constructor(nombre){
        this.nombre = nombre;
    }

    async save(objeto) {
        const archivo = await fs.promises.readFile(this.nombre, 'utf-8');
        const archivoParsed = JSON.parse(archivo);
        let id = 1;
        archivoParsed.forEach(element => {
            if(element.id >= id){
                id = element.id + 1;
            }
        });
        objeto.id = id;
        archivoParsed.push(objeto);
        await fs.promises.writeFile(this.nombre, JSON.stringify(archivoParsed, null, 2));
        return id;
    }

    async getById(id){
        const archivo = await fs.promises.readFile(this.nombre, 'utf-8');
        const archivoParsed = JSON.parse(archivo);
        let objetoSelected = null;
        archivoParsed.forEach(element =>{
            if(element.id == id) {
                objetoSelected = element;
            }
        });
        return objetoSelected;
    }

    async getAll() {
        const archivo = await fs.promises.readFile(this.nombre, 'utf-8');
        const archivoParsed = JSON.parse(archivo);
        return archivoParsed;
    }

    async deleteById(id) {
        const archivo = await fs.promises.readFile(this.nombre, 'utf-8');
        const archivoParsed = JSON.parse(archivo);
        let indexSelected = -1;
        archivoParsed.forEach((element, index) => {
            if(element.id == id) {
                indexSelected = index;
            }
        });
        if (indexSelected != -1) {
            archivoParsed.splice(indexSelected, 1);
            await fs.promises.writeFile(this.nombre, JSON.stringify(archivoParsed, null, 2));
        }
    }

    async deleteAll() {
        const emptyArray = [];
        await fs.promises.writeFile(this.nombre, JSON.stringify(emptyArray, null, 2));
    }

}


let product1 ={
    title:'Queso',
    price: 1250,
    thumbnail:'https://www.lacteoslatam.com/wp-content/uploads/2022/09/Estudio-de-la-transferencia-de-NaCl-en-el-queso-costeno-picado.jpg'
}
let product2 ={
    title:'Jamon',
    price: 2100,
    thumbnail:'https://http2.mlstatic.com/D_NQ_NP_712474-MLA46939913329_082021-O.jpg'
}
let product3 ={
    title:'Mortadela',
    price: 1340,
    thumbnail:'https://tusuper.com.ar/image/cache/catalog/P2020/Carnes-Fiambres/mortadela---800x800.jpg'
}
let product4 ={
    title:'Salame',
    price: 1930,
    thumbnail:'https://http2.mlstatic.com/D_NQ_NP_681853-MLA47272906419_082021-O.jpg'
}

// const implementar = async() => {
//     const list = new Contenedor('productos.txt');
//     await list.save(product1);
//     await list.save(product2);
//     await list.save(product3);
//     await list.save(product4);
// }

// implementar();

const list = new Contenedor('productos.txt');

//Endpoints

aplicacion.get('/productos', async (peticion, respuesta) => {
    const all = await list.getAll();
    respuesta.json(all);
  });
  
aplicacion.get('/indiceRandom', async (peticion, respuesta) => {
   const all = await list.getAll();
   const random = Math.floor(Math.random() * all.length);
   //Llamado a la funcion para obtener el id
   respuesta.json({random: random});
});
  

const servidor = aplicacion.listen(port, () => {
    console.log(`Server listening to: ${servidor.address().port}`);
});
  
  servidor.on('error', error => console.log(`Error: ${error}`));