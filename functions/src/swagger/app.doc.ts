export const swaggerOptions ={
    swaggerDefinition: {
        openapi: "3.0.3",
        info: {
            title: "API MASP",
            version: "0.3.1",
            description: "API para el manejo de la información de MASP",
            contact:{
                name: "Alexis Prado",
            }
        },
        servers:[
            {
                url: "http://localhost:5000/masp-cd84a/us-central1/app",
                description: "Local DEV server"
            },
        ]
    },
    basePath: "/",
    apis: [
        "./src/controllers/personas/agente.controller.ts",
        "./src/controllers/personas/cliente.controller.ts",
        "./src/controllers/personas/proveedor.controller.ts",
        "./src/controllers/venta.controller.ts",
        "./src/controllers/seguimiento.controller.ts",
        "./src/controllers/inventario.controller.ts",
        "./src/controllers/ordCompra.controller.ts",
        "./src/controllers/factura.controller.ts",
    ]
}