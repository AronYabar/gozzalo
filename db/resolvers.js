
const Usuario = require('../models/Usuarios');
const Categoria = require('../models/Categorias');
const Imagen = require('../models/Imagenes');
const Empresa = require('../models/Empresas');
const Sucursal = require('../models/Sucursales');
const Departamento = require('../models/Departamentos');
const Parametro = require('../models/Parametros');
const Provincia = require('../models/Provincias');
const Banco = require('../models/Bancos');
const Distrito = require('../models/Distritos');
const Producto = require('../models/Productos');
const Banner = require('../models/Banners');
const UserUbicacion=require('../models/UserUbicaciones');
const bcryptjs=require('bcryptjs');
const lodash = require('lodash');
const rad2deg=require('rad2deg');
const deg2rad = require('deg2rad')  
const jwt = require('jsonwebtoken');
const request = require('request');
const slugConvert = require('slug');
var AWS = require('aws-sdk');

const {PubSub} = require('graphql-subscriptions');
const { count } = require('../models/Usuarios');
const pubsub = new PubSub();
require('dotenv').config({path:'variables.env'});



const createToken = (user, secret) => {
    const { id,tipoUsuario,tipoDocumento,nroDocumento,nombres,apellidos,
        fechaNacimiento,email,celular,foto,password} = user;
    
    return jwt.sign( { id,tipoUsuario,tipoDocumento,nroDocumento,nombres,apellidos,
        fechaNacimiento,email,celular,foto,password}, secret )
}
const posts = [
    {
      author: "Nelson",
      comment: "Hello",
    },
    {
      author: "Steve",
      comment: "Hello GraphQL",
    },
  ];
const POST_ADDED = "POST_ADDED";
//Resolvers 
const resolvers ={
    Subscription: {
        postAdded: {
          // Additional event labels can be passed to asyncIterator creation
          subscribe: () => pubsub.asyncIterator([POST_ADDED]),
        }
    },
    Query: {
        
        getMercadoPago: async(_, { input }) => {
        //Step 1 - Set the headers
        var headers = {
            'Authorization':    'Bearer TEST-7866448415323384-121119-20e57643680212d598f1049e44d578b1-686286024',
            'Content-Type':     'application/json'
        }
        /*
        //Step 2 - Configure the request
        var options = {
            url     : 'https://api.mercadopago.com/v1/customers/search?email=aronquis123@gmail.com',
            method  : 'GET',
            jar     : true,
            headers : headers
        }
        //Step 3 - do the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                
                console.log(body);
            }
            else{
                console.log(error);
            }
        });
        */
        ////POST
        var options1 = {
            url     : 'https://api.mercadopago.com/v1/customers',
            method  : 'POST',
            jar     : true,
            headers : headers,
            body: {
                "email":"aron123456@gmail.com","first_name":"aron","last_name":"yabar"
              },
            json:true
            
            
        }
        request(options1, function (error, response, body) {
            
            console.log(error);
            console.log(JSON.stringify(response));
            console.log(body);
        });
        },
        getFiltroPrecioOferta: async(_, { input }) => {
            const productos = await Producto.find({}).populate('Categorias').populate('sucursales');
            let precios=[]
            for (let index = 0; index < productos.length; index++) {
                if(productos[index].sucursales.length>0){
                    for (let index2 = 0; index2 < productos[index].sucursales.length; index2++) {
                        let DistanciaRadianes=rad2deg(Math.acos((Math.sin(deg2rad(input.latitud))*Math.sin(deg2rad(productos[index].sucursales[index2].latitud))) + (Math.cos(deg2rad(input.latitud))*Math.cos(deg2rad(productos[index].sucursales[index2].latitud))*Math.cos(deg2rad(input.longitud-productos[index].sucursales[index2].longitud)))));
                        let distancia = DistanciaRadianes * 111.13384;
                        if(distancia<=50){
                            precios.push(productos[index].precioOferta)
                            break 
                        }
                    }
                }
            }
            //let DistanciaRadianes=rad2deg(Math.acos((Math.sin(deg2rad(input.latitud1))*Math.sin(deg2rad(input.latitud2))) + (Math.cos(deg2rad(input.latitud1))*Math.cos(deg2rad(input.latitud2))*Math.cos(deg2rad(input.longitud1-input.longitud2)))));
            //let distancia = DistanciaRadianes * 111.13384;
            return [Math.min(...precios),Math.max(...precios)]
        },
        getPrecioReal: async(_, { input }) => {
            const productos = await Producto.find({}).populate('Categorias').populate('sucursales');
            let precios=[]
            for (let index = 0; index < productos.length; index++) {
                if(productos[index].sucursales.length>0){
                    for (let index2 = 0; index2 < productos[index].sucursales.length; index2++) {
                        let DistanciaRadianes=rad2deg(Math.acos((Math.sin(deg2rad(input.latitud))*Math.sin(deg2rad(productos[index].sucursales[index2].latitud))) + (Math.cos(deg2rad(input.latitud))*Math.cos(deg2rad(productos[index].sucursales[index2].latitud))*Math.cos(deg2rad(input.longitud-productos[index].sucursales[index2].longitud)))));
                        let distancia = DistanciaRadianes * 111.13384;
                        if(distancia<=50){
                            precios.push(productos[index].precioReal)
                            break 
                        }
                    }
                }
            }
            //let DistanciaRadianes=rad2deg(Math.acos((Math.sin(deg2rad(input.latitud1))*Math.sin(deg2rad(input.latitud2))) + (Math.cos(deg2rad(input.latitud1))*Math.cos(deg2rad(input.latitud2))*Math.cos(deg2rad(input.longitud1-input.longitud2)))));
            //let distancia = DistanciaRadianes * 111.13384;
            return [Math.min(...precios),Math.max(...precios)]
        },
        getBusquedaAvanzada: async(_, { input }) => {
            const options = {
                populate: [{path:"Categorias"},{path: "sucursales",populate:{path:"empresa",populate:{path:"Bancos"}}}],
                page: input.page,
                limit: input.numberPages,
                "sort" :  [[ 'creation' , 'desc' ]]
            };
            //para no mandar vacio al $and
            const sentencia=[{"slug":{"$exists": true}}]
            if(input.categoriaSlug!=""){
                sentencia.push({"categoriaSlug": input.categoriaSlug})
            }
            if(input.precioCash.length>=2){
                
                sentencia.push({"precioOferta": {"$lte": input.precioCash[1]}})
                sentencia.push({"precioOferta": {"$gte": input.precioCash[0]}})
            }
            if(input.precioNormal.length>=2){
                
                sentencia.push({"precioReal": {"$lte": input.precioNormal[1]}})
                sentencia.push({"precioReal": {"$gte": input.precioNormal[0]}})
            }

            const productos=await Producto.paginate({'$and': sentencia},options);
            
            let productosFinal=[]
            if(input.ubicacion.latitud!="" && input.ubicacion.longitud!=""){
                for (let index = 0; index < productos.docs.length; index++) {
                    if(productos.docs[index].sucursales.length>0){
                        for (let index2 = 0; index2 < productos.docs[index].sucursales.length; index2++) {
                            let DistanciaRadianes=rad2deg(Math.acos((Math.sin(deg2rad(input.ubicacion.latitud))*Math.sin(deg2rad(productos.docs[index].sucursales[index2].latitud))) + (Math.cos(deg2rad(input.ubicacion.latitud))*Math.cos(deg2rad(productos.docs[index].sucursales[index2].latitud))*Math.cos(deg2rad(input.ubicacion.longitud-productos.docs[index].sucursales[index2].longitud)))));
                            let distancia = DistanciaRadianes * 111.13384;
                            if(distancia<=input.distancia){
                                productosFinal.push(productos.docs[index]) 
                            }
                            
                        }
                    }
                }
                
                productos.docs=productosFinal
            }
            final_respuestas=lodash.slice(productos.docs,(input.page-1)*input.numberPages, input.numberPages*input.page);
            final_respuestas.NroItems=productos.docs.length;
            final_respuestas.data=final_respuestas
            return final_respuestas;
            /*
            productos.data=productos.docs;
            
            productos.NroItems=productos.totalDocs;
            if(!productos){
                return [];
            }
            return productos;
            */
            
            
        },
        posts() {
            return posts
        },
        getBanners: async (_, {  }) => {
            //Revisar si existe el producto
            //const categorias = await Categoria.find({}).skip(1).limit(5);
            const banners = await Banner.find({});
            
            return banners;
       },
       getBannersID: async(_, { id }) => {
           //Revisar si existe el producto
           const banners = await Banner.findById(id);
           
           return banners;
       },
        getParametro: async (_, {}) =>{
            const parametro = await Parametro.findOne({});
            return parametro;
        },
        getPuntos: async (_, {token}) => {
            const usuario = await Usuario.findOne({ token: token });
            
            if(!usuario){
                throw new Error('No existe Usuario');
            }
            const userUbicaciones=await UserUbicacion.find({ userId: usuario.id,estadoSuma:0 });
            
            let tiempo_acu=0;
            
            for (let index = 0; index < userUbicaciones.length; index++) {
                
                if(userUbicaciones[index].TiempoConeccion && userUbicaciones[index].valorPuntos){
                    tiempo_acu+=userUbicaciones[index].TiempoConeccion*userUbicaciones[index].valorPuntos
                    if(userUbicaciones[index].estado=="0"){
                        await UserUbicacion.findOneAndUpdate({_id : userUbicaciones[index].id},{estadoSuma:1},{ new: true});
                    }
                }
                
            }
            var mnts =tiempo_acu / 60;
            
            let numero=mnts.toString();
            let num_partido = numero.split(".");
            if(!usuario.totalPuntos){
                usuario.totalPuntos=parseFloat(num_partido[0])
            }
            else{
                usuario.totalPuntos=parseFloat(usuario.totalPuntos)+parseFloat(num_partido[0])
            }
            
            
            usuario_final=await Usuario.findOneAndUpdate({_id : usuario.id}, usuario, { new: true});
            return usuario_final.totalPuntos
            
        },
        getCategoriasUsuarios: async (_, {token}) => {
            const usuario = await Usuario.findOne({ token: token }).populate('categoriasPreferidas');
            
            
            return usuario;
        },
        getBancos: async (_, {numberPages,page}) => {
            const options = {
                page: page,
                limit: numberPages,
                "sort" :  [[ 'creation' , 'desc' ]]
            };
            const bancos = await Banco.paginate({}, options);
            bancos.data=bancos.docs;
            bancos.NroItems=bancos.totalDocs;
            return bancos;
            
        },
        getBancosID: async (_, { id}) => {
            //Revisar si existe el producto
            //const categorias = await Categoria.find({}).skip(1).limit(5);
            const bancos = await Banco.findById(id );
            console.log(bancos);
            return bancos;
            
        },
        getDistritos: async (_, {ProvCodi}) => {
            //Revisar si existe el producto
            //const categorias = await Categoria.find({}).skip(1).limit(5);
            const distritos = await Distrito.find({ProvCodi:ProvCodi} );
            return distritos;
            
        },
        getProvincias: async (_, { DeparCodi}) => {
            //Revisar si existe el producto
            //const categorias = await Categoria.find({}).skip(1).limit(5);
            const provincias = await Provincia.find({DeparCodi:DeparCodi} );
            console.log(provincias);
            return provincias;
            
        },
        getDepartamentos: async (_, { }) => {
            //Revisar si existe el producto
            //const categorias = await Categoria.find({}).skip(1).limit(5);
            const departmentos = await Departamento.find({});
            
            return departmentos;
            
        },
        getImagenes: async (_, { numberPages,page  }) => {
            const options = {
                page: page,
                limit: numberPages,
                "sort" :  [[ 'creation' , 'desc' ]]
            };
            const imagenes = await Imagen.paginate({}, options);
            imagenes.data=imagenes.docs;
            imagenes.NroItems=imagenes.totalDocs;
            return imagenes;
            
            
        },
        getCategorias: async (_, {  }) => {
             //Revisar si existe el producto
             //const categorias = await Categoria.find({}).skip(1).limit(5);
             const categorias = await Categoria.find({});
             
             return categorias;
        },
        getCategoriaSlug: async(_, { slug }) => {
            //Revisar si existe el producto
            const categorias = await Categoria.findOne({ slug: slug });
            
            return categorias;
        },
        getSucursales: async (_, { numberPages,page }) => {
            const options = {
                populate: {path: "empresa",populate:{path:"Bancos"}},
                page: page,
                limit: numberPages,
                "sort" :  [[ 'creation' , 'desc' ]]
            };
            const sucursales = await Sucursal.paginate({}, options);
            sucursales.data=sucursales.docs;
            sucursales.NroItems=sucursales.totalDocs;
            return sucursales;  
        },
        getSucursalesID: async(_, { id }) => {
            //Revisar si existe el producto
            const sucursales = await Sucursal.findById(id).populate({path:'empresa',populate:{path:"Bancos"}});
            return sucursales;
        },
        getEmpresas: async(_, { numberPages,page }) => {
            //Revisar si existe el producto
             //const categorias = await Categoria.find({}).skip(1).limit(5);
             const options = {
                populate:{path: "Bancos"},
                page: page,
                limit: numberPages,
                "sort" :  [[ 'creation' , 'desc' ]]
              };
            const empresas=await Empresa.paginate({}, options);
            
            empresas.data=empresas.docs;
            
            for (var i = 0 in empresas.data) {
                empresas.data[i].sucursal=await Sucursal.find({empresa:empresas.data[i].id});
            }
            empresas.NroItems=empresas.totalDocs;
            
            return empresas;
        },
        getEmpresasSlug: async(_, { slug }) => {
            //Revisar si existe el producto
            const empresas = await Empresa.findOne({ slug: slug }).populate('Bancos');
            empresas.sucursal=await Sucursal.find({empresa:empresas.id});
            return empresas;
        },
        getSlugProductos: async(_, { slug }) => {
            const productos = await Producto.findOne({ slug: slug }).populate('Categorias').populate('sucursales');
            //productos.sucursales=await Sucursal.find({_id:{ $in: productos.sucursal }});
            return productos;
        },
        getProductosEmpresa: async(_, { empresaId,numberPages,page }) => {
            //Revisar si existe el producto
            try{
                const options = {
                    populate: [{path:"Categorias"},{path: "sucursales"}],
                    page: page,
                    limit: numberPages,
                    "sort" :  [[ 'creation' , 'desc' ]]
                };
                const productos = await Producto.paginate({"empresa": empresaId },options);
                productos.data=productos.docs;
                productos.NroItems=productos.totalDocs;
                if(!productos){
                    return [];
                }
                return productos;
            }
            catch(error){
                console.log(error)
            }
        },
        getProductosSucursales: async(_, { sucursalId,numberPages,page }) => {
            //Revisar si existe el producto
            try{
                const options = {
                    populate: [{path:"Categorias"},{path: "sucursales"}],
                    page: page,
                    limit: numberPages,
                    "sort" :  [[ 'creation' , 'desc' ]]
                };
                
                const productos = await Producto.paginate({"sucursales": sucursalId },options);
                console.log();
                productos.data=productos.docs;
                productos.NroItems=productos.totalDocs;
                if(!productos){
                    return [];
                }
                return productos;
            }
            catch(error){
                console.log(error)
            }
        },
        getProductosDestacados: async(_, { destacado,numberPages,page }) => {
            //Revisar si existe el producto
            try{
                const options = {
                    populate: [{path:"Categorias"},{path: "sucursales"}],
                    page: page,
                    limit: numberPages,
                    "sort" :  [[ 'creation' , 'desc' ]]
                };
                
                if(destacado!=""){
                    const productos = await Producto.paginate({"destacado": destacado },options);
                    productos.data=productos.docs;
                
                    productos.NroItems=productos.totalDocs;
                    if(!productos){
                        return [];
                    }
                    return productos;
                }
                else{
                    const productos = await Producto.paginate({},options);
                    productos.data=productos.docs;
                
                    productos.NroItems=productos.totalDocs;
                    if(!productos){
                        return [];
                    }
                    return productos;
                }
                
            }
            catch(error){
                console.log(error)
            }
        },
        getProductosCategorias: async(_, { categoriaSlug,numberPages,page }) => {
            //Revisar si existe el producto
            try{
                const options = {
                    populate: [{path:"Categorias"},{path: "sucursales"}],
                    page: page,
                    limit: numberPages,
                    "sort" :  [[ 'creation' , 'desc' ]]
                };
                const categoria = await Categoria.findOne({ slug: categoriaSlug });
                
                const productos = await Producto.paginate({"Categorias": categoria.id },options);
                productos.data=productos.docs;
                
                productos.NroItems=productos.totalDocs;
                if(!productos){
                    return [];
                }
                return productos;
            }
            catch(error){
                console.log(error)
            }
        },
        getDireccionesUsuarios: async(_, { token,numberPages,page }) => {
            //Revisar si existe el producto
            try{
                
                let users = await Usuario.findOne({token:token} );
                return users.direcciones;
            }
            catch(error){
                console.log(error)
            }
        }
    },
    Mutation: {
        CreateCategoriaFavoritaUsuario: async (_, { input } ) => {
            let beUser = await Usuario.findOne({token:input.token});
            if(beUser){
                await Usuario.findOneAndUpdate({token:input.token},  {$unset: {categoriasPreferidas:[]}});
                usuario = await Usuario.findOneAndUpdate({token:input.token}, {$push:{categoriasPreferidas:{$each:input.categoriasPreferidas}}}, { new: true}).populate('categoriasPreferidas');
                
                return usuario;
            } 
            /*
            let beUser = await Usuario.findOne({token:input.token,categoriasPreferidas:input.categoriaId});
            if(!beUser){
                
                usuario = await Usuario.findOneAndUpdate({token:input.token}, {$push:{categoriasPreferidas:{$each:input.categoriaId}}}, { new: true});
                usuario.Categorias=await Categoria.find({_id:usuario.categoriasPreferidas});
                return usuario;
            }
            else{
                beUser.Categorias=await Categoria.find({_id:beUser.categoriasPreferidas});
                return beUser;
            }
            */
            
        },
        DeleteCategoriaFavoritaUsuario: async (_, { input } ) => {
            let beUser = await Usuario.findOne({token:input.token,categoriasPreferidas:input.categoriaId});
            if(!beUser){
                throw new Error('CATEGORIA_NO_EXISTE');
            }
            else{
                usuario=await Usuario.findOne({token:input.token,categoriasPreferidas:input.categoriaId},function (err, result){
                    result.categoriasPreferidas.pull(input.categoriaId);
                    result.save();
                });
                return "EXITO";
            }
            usuario = await Usuario.findOneAndUpdate({_id : beUser.id}, {$push:{direcciones:{$each:[{'direccionEntrega':input.direccionEntrega,'informacionAdicional':input.informacionAdicional,'alias':input.alias,'latitud':input.latitud,'longitud':input.longitud}]}}}, { new: true});
            return usuario.direcciones[usuario.direcciones.length-1];
        },
        CreateDireccionesUsuario: async (_, { input } ) => {
            let beUser = await Usuario.findOne({token:input.token});
           
            if(!beUser){
                throw new Error('USER_NO_EXISTE');
            }
            usuario = await Usuario.findOneAndUpdate({_id : beUser.id}, {$push:{direcciones:{$each:[{'direccionEntrega':input.direccionEntrega,'informacionAdicional':input.informacionAdicional,'alias':input.alias,'latitud':input.latitud,'longitud':input.longitud}]}}}, { new: true});
            return usuario.direcciones[usuario.direcciones.length-1];
        },
        UpdateDireccionesUsuario: async (_, { input } ) => {
            let beUser = await Usuario.findOne({token:input.token});
           
            if(!beUser){
                throw new Error('USER_NO_EXISTE');
            }
            usuario = await Usuario.findOneAndUpdate({_id : beUser.id,"direcciones._id": input.id },{ "$set": {"direcciones.$": {'_id':input.id,'direccionEntrega':input.direccionEntrega,'informacionAdicional':input.informacionAdicional,'alias':input.alias,'latitud':input.latitud,'longitud':input.longitud}}});
            
            return input;
        },
        FavoritoDireccionesUsuario: async (_, { input } ) => {
            let beUser = await Usuario.findOne({token:input.token});
           
            if(!beUser){
                throw new Error('USER_NO_EXISTE');
            }
            let usuario_editado=null
            for (let i = 0; i < beUser.direcciones.length; i++) {
                
                if(input.id==beUser.direcciones[i].id){
                    usuario_editado = await Usuario.findOneAndUpdate({_id : beUser.id,"direcciones._id": input.id },{ "$set": {"direcciones.$": {'_id':input.id,'favorito':1,'direccionEntrega':beUser.direcciones[i].direccionEntrega,'informacionAdicional':beUser.direcciones[i].informacionAdicional,'alias':beUser.direcciones[i].alias,'latitud':beUser.direcciones[i].latitud,'longitud':beUser.direcciones[i].longitud}}});
                    
                }
                else{
                    await Usuario.findOneAndUpdate({_id : beUser.id,"direcciones._id": beUser.direcciones[i].id },{ "$set": {"direcciones.$": {'_id':beUser.direcciones[i].id,'favorito':0,'direccionEntrega':beUser.direcciones[i].direccionEntrega,'informacionAdicional':beUser.direcciones[i].informacionAdicional,'alias':beUser.direcciones[i].alias,'latitud':beUser.direcciones[i].latitud,'longitud':beUser.direcciones[i].longitud}}});
                }
                
            }
            usuario_editado = lodash.filter(usuario_editado.direcciones, { "id": input.id });
            return usuario_editado[0];
            
            
        },
        DeleteDireccionesUsuario: async (_, { input } ) => {
            let beUser = await Usuario.findOne({token:input.token});
           
            if(!beUser){
                throw new Error('USER_NO_EXISTE');
            }

            //Eliminar
            await Usuario.findOne({_id : beUser.id,"direcciones._id": input.id },function (err, result) {
                result.direcciones.id(input.id).remove();       
                result.save();
            });

            return "DIRECCION_ELIMINADA";
        },
        AddUsuarioUbicacion: async (_, { input } ) => {
            
            const beUser = await Usuario.findOne({token:input.token});
            const parametro = await Parametro.findOne({});
            if(beUser){
                if(input.tipoCoordenada==1){
                    input.userId=beUser.id;
                    input.valorPuntos=parametro.valorPuntos
                    input.creation=Date.now()
                    input.estado="1";
                    input.ubicaciones=[{'latitud':input.latitud,'longitud':input.longitud,'creation':Date.now()}];
                    const userUbicacion = new UserUbicacion(input);
                    const  userUbicaciones = await userUbicacion.save();
                    return userUbicaciones;
                }
                else{
                    const beUbicacion = await UserUbicacion.find({token:input.token}).sort({$natural:-1}).limit(1);
                    const ultimoUbicacion=beUbicacion[0].ubicaciones[beUbicacion[0].ubicaciones.length-1];
                    const seconds = parseInt(Math.abs(new Date() - ultimoUbicacion.creation) / (1000));
                    console.log(seconds);
                    if(seconds<=60 && beUbicacion[0].estado=="1"){
                        const userUbicaciones=await UserUbicacion.findOneAndUpdate({_id : beUbicacion[0].id}, {$push:{ubicaciones:{$each:[{'latitud':input.latitud,'longitud':input.longitud,'creation':Date.now()}]}}}, { new: true});
                        //sumar tiempo
                        const ultimoUbicacion=beUbicacion[0].ubicaciones[beUbicacion[0].ubicaciones.length-1];
                        const primeraUbicacion=beUbicacion[0].ubicaciones[0];
                        const TiempoConeccion=parseInt(Math.abs(ultimoUbicacion.creation - primeraUbicacion.creation) / 1000);
                        await UserUbicacion.findOneAndUpdate({_id : beUbicacion[0].id}, {'TiempoConeccion':TiempoConeccion}, { new: true});

                        return userUbicaciones;
                    }

                    else{
                        const ultimoUbicacion=beUbicacion[0].ubicaciones[beUbicacion[0].ubicaciones.length-1];
                        const primeraUbicacion=beUbicacion[0].ubicaciones[0];
                        const TiempoConeccion=parseInt(Math.abs(ultimoUbicacion.creation - primeraUbicacion.creation) / 1000);
                        await UserUbicacion.findOneAndUpdate({_id : beUbicacion[0].id}, {estado:"0",'TiempoConeccion':TiempoConeccion}, { new: true});
                        
                        const recupTotalConeccion = await UserUbicacion.find({token:input.token}, { "_id": false, "TiempoConeccion": true });
                        var array_total_coneccion=recupTotalConeccion.map(item => item.TiempoConeccion);
                        let numOr0 = n => isNaN(n) ? 0 : n;
                        let totalMin=array_total_coneccion.reduce((a, b) => numOr0(a) + numOr0(b));
                        await Usuario.findOneAndUpdate({_id : beUbicacion[0].userId}, {totalMinutos:totalMin}, { new: true});
                        throw new Error('FINALIZADO');
                    }
                    
                }
            }
            else{
                throw new Error('TOKEN_NO_EXISTE');
            }
            
            
            
            
        },
        LoginCelular: async (_, { input } ) => {
            
            //Revisar si el User esta Registrado
            const beUser = await Usuario.findOne({celular:input.nroCelular}).populate('categoriasPreferidas');
            
            if(!beUser){
                throw new Error('USUARIO_NO_EXISTE');
            }
            else{
                const passwordCorrect = await bcryptjs.compare( input.codigoSeguridad, beUser.password );
                
                let today =  Date.now();
                let diffMs = (today - beUser.creation); 
                let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                if(!passwordCorrect){
                    throw new Error('Código incorrecto. Vuélvelo a intentar.');
                }
                else{
                    if(diffMins>15){
                        throw new Error('Código expirado. Volver a reenviar código.');
                    }
                }
            }
            //beUser.Categorias=await Categoria.find({_id:beUser.categoriasPreferidas});
            return beUser;
        },
        GenerarTokenCelular: async (_, { input } ) => {
            let nroRamdom=Math.floor(Math.random() * (9999 - 1000 + 1) ) + 1000;
            var params = {
                Message: "!Hola! Tu código de verificacion Gózzalo es: "+nroRamdom+" No compartas este codigo con nadie.Nuestros empleados nunca te lo pediran.",
                PhoneNumber:input.nroCelular,
                MessageAttributes: {
                    'AWS.SNS.SMS.SenderID': {
                        'DataType': 'String',
                        'StringValue': 'SEANWASERE'
                    }
                }
            };
            var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
            publishTextPromise.then(
                function (data) {
                    input.messageId=data.MessageId;
                    
                }).catch(
                    function (err) {
                        throw new Error(err);
                    });
            
            const beUser = await Usuario.findOne({celular:input.nroCelular});
            if(beUser){
                const salt = await bcryptjs.genSalt(10);
                input.creation=Date.now();
                input.estado=1;
                input.password = await bcryptjs.hash(nroRamdom.toString(), salt);
                input.token=createToken(input, process.env.SECRET)
                
                usuarios = await Usuario.findOneAndUpdate({_id : beUser.id}, input, { new: true});
                usuarios.codigoSeguridad=nroRamdom;
                return usuarios;
            }
            else{
                
                //Hashear el Passwor
                input.celular=input.nroCelular;
                input.tipoUsuario="2";
                input.estado=0;
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(nroRamdom.toString(), salt);
               
                try {
                    //Guardar en la DB
                    
                    input.token=createToken(input, process.env.SECRET);
                   
                    const usuario = new Usuario(input);
                    usuario.save();
                    usuario.codigoSeguridad=nroRamdom;
                    return usuario;
                } catch(error){
                    throw new Error(error);
                    
                }
            }
            
        },
        addPost(_, args) {
            pubsub.publish(POST_ADDED, { postAdded: args });
            posts.push(args)
            return args
        },
        DeleteAsignaProductSucursal: async (_, { productoId,sucursalId } ) => {
           
            const productos = await Producto.findById(productoId);
            if(!productos){
                throw new Error('Producto no encontrada');
            }
            
            productos.sucursales.pull(sucursalId);
            productos.save();
            return "Producto Eliminada";
        },
        AsignarProductoSucursales: async (_, { input } ) => {
            const {sucursales,productoId} = input;
            input.sucursal=await Sucursal.findById(input.sucursales)
            let array_sucursales=[];
            
            for (let i = 0; i < input.productoId.length; i++) {
                ver_sucu=await Producto.findById(input.productoId[i]);
                
                if(!ver_sucu.sucursales || ver_sucu.sucursales.indexOf(input.sucursales)==-1){
                    productos=await Producto.findOneAndUpdate({_id : input.productoId[i]}, {$push:input}, { new: true}).populate('Categorias').populate('sucursales');
                    //productos.sucursales=await Sucursal.find({_id:{ $in: productos.sucursal }});
                    //productos.Categorias=Categoria.findById(productos.categoriaId);
                    array_sucursales.push(productos);
                    
                }
                else{
                    const productos=await Producto.findById(input.productoId[i]).populate('Categorias').populate('sucursales');
                    array_sucursales.push(productos);
                }    
            }
            return array_sucursales;
        },
        CreateProductos: async (_, { input } ) => {
            try {
                let empresa = await Empresa.findById(input.empresa);
                let categoria = await Categoria.findById(input.Categorias);
                input.categoriaSlug=categoria.slug
                input.empresaSlug=empresa.slug

                input.slug=slugConvert(input.nombre);
                const producto = new Producto(input);
                
                const  productos = await producto.save();
                return await Producto.findById(productos.id).populate('Categorias');
            } catch(error){
                console.log(error)
            }
        },
        UpdateProductos: async (_, { input } ) => {
            let productos = await Producto.findById(input.id);
            if(!productos){
                throw new Error('Banco no encontrada');
            }
            let categoria = await Categoria.findById(input.Categorias);
            let empresa = await Empresa.findById(input.empresa);

            input.categoriaSlug=categoria.slug
            input.empresaSlug=empresa.slug

            input.slug=slugConvert(input.nombre);
            productos = await Producto.findOneAndUpdate({_id : input.id}, input, { new: true}).populate('Categorias');
            return productos;
        },
        DeleteProductos: async (_, { input } ) => {
            let productos = await Producto.findById(id);
            if(!productos){
                throw new Error('Producto no encontrada');
            }

            //Eliminar
            await Producto.findOneAndDelete({_id: id});

            return "Producto Eliminada";
        },
        
        CreateBancos: async (_, { input } ) => {
            try {
                const bancos = new Banco(input);
                const  banco = await bancos.save();
                return banco;
            } catch(error){
                console.log(error)
            }
        },
        UpdateBancos: async (_, { input } ) => {
            let bancos = await Banco.findById(input.id);
            if(!bancos){
                throw new Error('Banco no encontrada');
            }
            bancos = await Banco.findOneAndUpdate({_id : input.id}, input, { new: true});
            return bancos;
        },
        DeleteBancos: async (_, { id }) => {
            let bancos = await Banco.findById(id);
            if(!bancos){
                throw new Error('Sucursal no encontrada');
            }

            //Eliminar
            await Banco.findOneAndDelete({_id: id});

            return "Banco Eliminada";
        },
        Login: async (_, { input } ) => {
            const {email,password} = input;
            //Revisar si el User esta Registrado
            const beUser = await Usuario.findOne({email});
            
            if(!beUser){
                throw new Error('El Usuario no existe');
            }
            //Revisar si el password es correct
            const passwordCorrect = await bcryptjs.compare( password, beUser.password );
            if(!passwordCorrect){
                throw new Error('Contraseña Incorrecta');
            }
            
            return beUser;
            
            
        },
        LogoutUsuarios: async (_,  {token}  ) => {
            let nroRamdom=Math.floor(Math.random() * (99999 - 10000 + 1) ) + 10000;
            let beUser = await Usuario.findOne({token:token});
           
            if(!beUser){
                throw new Error('USER_NO_EXISTE');
            }
            else{
                if(beUser.tipoUsuario==2){
                    const salt = await bcryptjs.genSalt(10);
                    let password_nuevo = await bcryptjs.hash(nroRamdom.toString(), salt);
                    usuario = await Usuario.findOneAndUpdate({_id : beUser.id}, {password:password_nuevo}, { new: true});
                }
            }
            return "EXITO";
        },
        UpdateUsuario: async (_,  {input}  ) => {
            let date = new Date(input.fechaNacimiento)
            let birth_day = date.getDate()
            let birth_month = date.getMonth() + 1
            let birth_year = date.getFullYear()
            if(birth_month < 10){
                birth_month=`0${birth_month}`;
            }else{
                birth_month=`${birth_month}`;
            }

            today_date = new Date();
            today_year = today_date.getFullYear();
            today_month = today_date.getMonth();
            today_day = today_date.getDate();
            age = today_year - birth_year;

            if (today_month < (birth_month - 1)) {
                age--;
            }
            if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
                age--;
            }
            if(age<18){
                
                throw new Error('Por favor ingresa una fecha válida');
            }
            if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input.email)){
                throw new Error('Por favor ingresa un correo válido');
            }

            let beUseremail = await Usuario.findOne({token:input.token});
            
            if(beUseremail.email){
                if(beUseremail.email!=input.email){
                    let beUser = await Usuario.findOne({email:input.email});
                    if(beUser){
                        throw new Error('El correo ya está en uso, ingresar otro.');
                    }
                }
            }
            else{
                let beUser = await Usuario.findOne({email:input.email});
                if(beUser){
                    throw new Error('El correo ya está en uso, ingresar otro.');
                }
            }

            let beUser = await Usuario.findOne({token:input.token});
            if(!beUser){
                throw new Error('USER_NO_EXISTE');
            }
            if(beUser.estadoRegistro=='0' || !beUser.estadoRegistro){
                input.totalPuntos=parseFloat(beUser.totalPuntos)+50;
                input.estadoRegistro='1';
            }
            
            usuario = await Usuario.findOneAndUpdate({_id : beUser.id}, input, { new: true});
            
            return usuario;
        },
        CreateUsuario: async (_, { input } ) => {
            
            //Revisar si el User esta Registrado
            const beUser = await Usuario.findOne({email:input.email});
            if(beUser){
                throw new Error('El correo ya está en uso, ingresar otro.');
            }
            
            //Hashear el Passwor
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(input.password, salt);
            try {
                //Guardar en la DB
                input.token=createToken(input, process.env.SECRET)
                const usuario = new Usuario(input);
                usuario.save();
                //usuario = await Usuario.findOneAndUpdate({ "_id": usuario.id }, { "$set": { "token":token_gene}}, { new: true});
                return usuario;
            } catch(error){
                console.log(error)
            }
        },
        CreateCategoriaProducto: async (_, { input } ) => {
            const {id,nombre,slug,imagen,openGraph,estado,descripcion,keywords,color:String,iconIos,iconAndroid,siluetaIos,siluetaAndroid} = input;
            input.slug=slugConvert(input.nombre);
            try {
                const categoria = new Categoria(input);
                const  resultado = await categoria.save();

                return resultado;
            } catch(error){
                console.log(error)
            }
        },
        UpdateCategoriaProducto: async (_, { input } ) => {
            input.slug=slugConvert(input.nombre);
            let categoria = await Categoria.findById(input.id);
            if(!categoria){
                throw new Error('Categoria no encontrada');
            }
            //Almacenar en la DB
            input.slug=slugConvert(input.nombre);
            categoria = await Categoria.findOneAndUpdate({_id : input.id}, input, { new: true});
            return categoria;
        },
        DeleteCategoriaProducto: async (_, { id }) => {
            let productos = await Producto.find({ categoriaId: id });
            if(productos.length>0){
                throw new Error('ERROR_PRODUCTOS_ACT');
            }

            //Eliminar
            await Categoria.findOneAndDelete({_id: id});

            return "Categoria Eliminada";
        },
        CreateImagen: async (_, { input } ) => {
            try {
                const imagen = new Imagen(input);
                const  resultado = await imagen.save();

                return resultado;
            } catch(error){
                console.log(error)
            }
        },
        UpdateImagen: async (_, { input } ) => {
            let imagen = await Imagen.findById(input.id);
            if(!imagen){
                throw new Error('Categoria no encontrada');
            }
            imagen = await Imagen.findOneAndUpdate({_id : input.id}, input, { new: true});
            return imagen;
        },
        DeleteImagen: async (_, { id }) => {
            let imagen = await Imagen.findById(id);
            if(!imagen){
                throw new Error('Imagen no encontrada');
            }

            //Eliminar
            await Imagen.findOneAndDelete({_id: id});

            return "Imagen Eliminada";
        },
        CreateEmpresas: async (_, { input } ) => {
            try {
                input.slug=slugConvert(input.nombre);
                const empresa = new Empresa(input);
                const  resultado = await empresa.save();
                return resultado;
            } catch(error){
                console.log(error)
            }
        },
        UpdateEmpresas: async (_, { input } ) => {
            let empresa = await Empresa.findById(input.id);
            if(!empresa){
                throw new Error('Empresa no encontrada');
            }
            input.slug=slugConvert(input.nombre);
            empresa = await Empresa.findOneAndUpdate({_id : input.id}, input, { new: true});
            return empresa;
        },
        DeleteEmpresas: async (_, { id }) => {
            let empresa = await Empresa.findById(id);
            if(!empresa){
                throw new Error('Empresa no encontrada');
            }
            else{
                let sucursales=await Sucursal.findOne({empresa:empresa.id});
                if(sucursales){
                    throw new Error("EMPRESA_TIENE_SUCURSALES");
                }
                
            }
            
            //Eliminar
            await Empresa.findOneAndDelete({_id: id});

            return "Empresa Eliminada";
        },
        CreateSucursal: async (_, { input } ) => {
            try {
                let empresa = await Empresa.findById(input.empresa);
                input.empresaSlug=empresa.slug

                const sucursal = new Sucursal(input);
                const  resultado = await sucursal.save();
                return resultado;
            } catch(error){
                console.log(error)
            }
        },
        UpdateSucursal: async (_, { input } ) => {
            let sucursal = await Sucursal.findById(input.id);
            if(!sucursal){
                throw new Error('Sucursal no encontrada');
            }
            let empresa = await Empresa.findById(input.empresa);
            input.empresaSlug=empresa.slug

            sucursal = await Sucursal.findOneAndUpdate({_id : input.id}, input, { new: true});
            return sucursal;
        },
        DeleteSucursal: async (_, { id }) => {
            let sucursal = await Sucursal.findById(id);
            if(!sucursal){
                throw new Error('Sucursal no encontrada');
            }

            //Eliminar
            await Sucursal.findOneAndDelete({_id: id});

            return "Sucursal Eliminada";
        },
        CreateBanner: async (_, { input } ) => {
            try {
                const banner = new Banner(input);
                const  resultado = await banner.save();
                return resultado;
            } catch(error){
                console.log(error)
            }
        },
        UpdateBanner: async (_, { input } ) => {
            let banner = await Banner.findById(input.id);
            if(!banner){
                throw new Error('Sucursal no encontrada');
            }
            banner = await Banner.findOneAndUpdate({_id : input.id}, input, { new: true});
            return banner;
        },
        DeleteBanner: async (_, { id }) => {
            let banner = await Banner.findById(id);
            if(!banner){
                throw new Error('banner no encontrada');
            }

            //Eliminar
            await Banner.findOneAndDelete({_id: id});

            return "banner Eliminada";
        }
    }
}

module.exports = resolvers;