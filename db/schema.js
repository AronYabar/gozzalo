const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`
    
    type Usuario {
        id: ID
        tipoUsuario:Int
        tipoDocumento:Int
        nroDocumento:String
        nombres: String
        apellidos: String
        fechaNacimiento:String
        email:String
        celular:String
        genero:String
        foto:String
        estado:String
        password:String
        token:String
        totalPuntos:String
        estadoRegistro:String
        categoriasPreferidas:[Categoria!]
        direcciones:[direcciones!]
        creation: String
    }

    input UsuarioInput {
        id: ID
        tipoUsuario:Int
        tipoDocumento:Int
        nroDocumento:String
        nombres: String
        apellidos: String
        fechaNacimiento:String
        genero:String
        email:String
        celular:String
        foto:String
        password:String
        token:String
        categoriasPreferidas:[String!]
    }
    input loginInput{
        email:String
        nroCelular:String
        codigoSeguridad:String
        password:String
    }
    type Categoria{
        id: ID
        nombre:String
        slug:String
        imagen:String
        openGraph:String
        estado:String
        color:String
        iconIos: String
        iconAndroid: String
        siluetaIos:String
        siluetaAndroid:String
        descripcion:String
        keywords:String
        creation: String
    }
    input CategoriaInput{
        id: ID
        nombre:String
        slug:String
        imagen:String
        openGraph:String
        estado:Int
        color:String
        iconIos: String
        iconAndroid: String
        siluetaIos:String
        siluetaAndroid:String
        descripcion:String
        keywords:String
    }
    type empresa {
        id:ID
        nombre: String
        cci:String
        slug:String
        ruc: String
        email: String
        telefono: String
        nroInterbancario:String
        nroCuenta: String
        estado:Int
        fotoPerfil: String
        creation: String
        Bancos:Bancos
        sucursal: [sucursal]
    }
    input empresaInput {
        id:ID
        nombre: String
        slug:String
        cci:String
        ruc: String
        email: String
        telefono: String
        nroInterbancario:String
        estado:Int
        nroCuenta: String
        fotoPerfil: String
        Bancos:String
    }
    type sucursal {
        id: ID
        sucursalId:String
        nombre: String
        departamentoID: String
        departamentoNombre: String
        provinciaID: String
        provinciaNombre: String
        distritoID: String
        distritoNombre: String
        direccion: String
        telefono: String
        estado:Int
        latitud:String
        longitud:String
        creation: String
        empresa:empresa
    }
    input sucursalInput {
        id: ID
        sucursalId:String
        nombre: String
        departamentoID: String
        departamentoNombre: String
        provinciaID: String
        provinciaNombre: String
        distritoID: String
        estado:Int
        distritoNombre: String
        direccion: String
        telefono: String
        latitud:String
        longitud:String
        empresa: ID
    }
    type Imagen {
        id:ID
        nombre:String
        url:String
        creation: String
    }
    input ImagenInput {
        id:ID
        nombre:String
        url:String
    }
    type GetImagenes{
        NroItems:Int
        data:[Imagen!]
    }
    type Departamento {
        DeparCodi:String
        DeparNom:String
    }
    type Provincia {
        ProvCodi:String
        ProvNom:String
        DeparCodi:String
    }
    type Distrito {
        id:ID
        DistCodi:String
        DistNom:String
        ProvCodi:String
    }
    type GetEmpresas{
        NroItems:Int
        data:[empresa!]
    }
    type GetSucursal{
        NroItems:Int
        data:[sucursal!]
    }
    type Bancos{
        id:ID
        titulo:String
        imagen:String
        creation: String
    }
    input BancosInput{
        id:ID
        titulo:String
        imagen:String
    }
    type GetBancos{
        NroItems:Int
        data:[Bancos!]
    }
    type Productos{
        id:ID
        nombre:String
        slug:String
        descripcionCorta:String
        descripcionLarga:String
        estado:Int
        destacado:Int
        precioReal:Float
        precioOferta:Float
        fotoPrincipal:String
        fotoSecundaria:String
        galeria:[String]
        keywords:String
        
        empresa: String
        creation: String
        Categorias:Categoria
        sucursales:[sucursal!] 
    }
    input ProductosInput{
        id:ID
        nombre:String
        slug:String
        descripcionCorta:String
        descripcionLarga:String
        estado:Int
        destacado:Int
        precioReal:Float
        precioOferta:Float
        fotoPrincipal:String
        fotoSecundaria:String
        galeria:[String]
        keywords:String
        empresa: String
        Categorias:String
        sucursales:[String!]
    }
    type GetProductos {
        NroItems:Int
        data:[Productos!]
    }
    
    input AsignarSucursalesInput{
        sucursales:String
        productoId:[String!]
    }
    type CelularToken {
        nroCelular: String
        codigoSeguridad:String
    }
    input CelularTokenInput {
        nroCelular: String
        codigoSeguridad:String
    }
    type Post {
        author: String
        comment: String
    }
    type Subscription {
        postAdded: Post
    }
    type coordenadas {
        latitud:String
        longitud:String
        creation:String
    }
    input coordenadasInput {
        latitud:String
        longitud:String
       
    }
    type UsuarioUbicacion {
        id:ID
        userId: String
        ubicaciones:[coordenadas!]
    }
    input UsuarioUbicacionInput {
        token: String
        tipoCoordenada:Int
        valorPuntos:Float
        latitud:String
        longitud:String
    }
    type direcciones{
        id:ID
        favorito:Int
        direccionEntrega:String
        informacionAdicional:String
        alias:String
        latitud:String
        longitud:String
    }
    input direccionesInput{
        id:ID
        direccionEntrega:String
        informacionAdicional:String
        alias:String
        latitud:String
        longitud:String
        token:String
    }
    type parametro {
        valorPuntos:Float
    }
    type Banner{
        id:ID
        nombre:String
        foto:String
        url:String
    }
    input BannerInput{
        id:ID
        nombre:String
        foto:String
        url:String
    }
    input BusquedaAvanzadaInput {
        page:Int
        numberPages:Int
        precioNormal:[Float!],
        precioCash:[Float!],
        categoriaSlug:String,
        distancia:String
        ubicacion:coordenadasInput
    }
    
    type Query {
        
        posts: [Post]
        #mercadopago
        getMercadoPago: String
        #Filtros
        #busqueda Avanzada
        getBusquedaAvanzada(input:BusquedaAvanzadaInput): GetProductos
        #Filtros
        getPrecioReal(input:coordenadasInput):[Float!]
        getFiltroPrecioOferta(input:coordenadasInput): [Float!]
        #banner
        getBanners: [Banner!]
        getBannersID(id:String): Banner
        #get direcciones usuarios
        getCategoriasUsuarios(token:String): Usuario
        #get direcciones usuarios
        getDireccionesUsuarios(token:String): [direcciones!]
        #productos
        getProductosDestacados(destacado:String,numberPages:Int,page:Int): GetProductos
        getProductosCategorias(categoriaSlug:String,numberPages:Int,page:Int): GetProductos
        getProductosSucursales(sucursalId:String,numberPages:Int,page:Int): GetProductos
        getProductosEmpresa(empresaId:String,numberPages:Int,page:Int): GetProductos
        getSlugProductos(slug:String): Productos
        #empresas
        getBancos(numberPages:Int,page:Int): GetBancos
        getBancosID(id:String): Bancos
        #empresas
        getEmpresas(numberPages:Int,page:Int): GetEmpresas
        getEmpresasSlug(slug:String): empresa
        #localizacion
        getDepartamentos: [Departamento]
        getProvincias(DeparCodi:String): [Provincia]
        getDistritos(ProvCodi:String): [Distrito]
        #categorias
        getSucursales(numberPages:Int,page:Int): GetSucursal
        getSucursalesID(id:String!) : sucursal   
        #imagenes
        getImagenes(numberPages:Int,page:Int): GetImagenes
        #categorias
        getCategorias: [Categoria]
        getCategoriaSlug(slug:String!) : Categoria     
        #puntos por tiempo
        getPuntos(token:String) : Float
        getParametro: parametro
         
    }
    
    type Mutation {
        #productos
        CreateBanner(input: BannerInput) : Banner
        UpdateBanner(input: BannerInput) : Banner
        DeleteBanner(id:String):String
        #guardar ubicaciones
        CreateCategoriaFavoritaUsuario(input:UsuarioInput): Usuario
        DeleteCategoriaFavoritaUsuario(input:UsuarioInput): String
        #guardar ubicaciones
        CreateDireccionesUsuario(input:direccionesInput): direcciones
        UpdateDireccionesUsuario(input:direccionesInput): direcciones
        DeleteDireccionesUsuario(input:direccionesInput): String
        FavoritoDireccionesUsuario(input:direccionesInput):direcciones
        #guardar ubicaciones
        AddUsuarioUbicacion(input:UsuarioUbicacionInput): UsuarioUbicacion
        #salir del usuario
        LogoutUsuarios(token: String) : String
        #generar Token celular
        LoginCelular(input: loginInput) : Usuario
        #generar Token celular
        GenerarTokenCelular(input:CelularTokenInput): Usuario
        ###
        addPost(author: String, comment: String): Post
        DeleteAsignaProductSucursal(productoId:String,sucursalId:String):String
        #asignar productos sucursales
        AsignarProductoSucursales(input: AsignarSucursalesInput) : [Productos!]
        #productos
        CreateProductos(input: ProductosInput) : Productos
        UpdateProductos(input: ProductosInput) : Productos
        DeleteProductos(id:String):String
        #empresa
        CreateBancos(input: BancosInput) : Bancos
        UpdateBancos(input: BancosInput) : Bancos
        DeleteBancos(id:String):String
        #empresa
        CreateSucursal(input: sucursalInput) : sucursal
        UpdateSucursal(input: sucursalInput) : sucursal
        DeleteSucursal(id:String):String
        #empresa
        CreateEmpresas(input: empresaInput) : empresa
        UpdateEmpresas(input: empresaInput) : empresa
        DeleteEmpresas(id:String):String
        #categorias
        CreateCategoriaProducto(input: CategoriaInput) : Categoria
        UpdateCategoriaProducto(input: CategoriaInput) : Categoria
        DeleteCategoriaProducto(id:String):String
        #imagenes
        CreateImagen(input: ImagenInput) : Imagen
        UpdateImagen(input: ImagenInput) : Imagen
        DeleteImagen(id:String):String
        
        #Usuarios
        CreateUsuario(input: UsuarioInput) : Usuario
        UpdateUsuario(input: UsuarioInput) : Usuario
        Login(input: loginInput) : Usuario
        
    }
`;

module.exports = typeDefs;