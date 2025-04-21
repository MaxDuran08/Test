from flask import Flask
from flask_cors import CORS
from app.config.config import Config
from app.controllers.gerente_controler import ver_supervisor_bp,reporte_ganancias_bp,reporte_factura_bp, reporte_ventas_bp, reporte_ventas_periodo_bp,alerta_general_bp
from app.controllers.supervisor_controller import mod_producto_bp,modificar_empleado_bp, agregar_empleado_bp,obtener_libro_bp,modificar_libro_bp,eliminar_libro_bp,eliminar_producto_bp, ver_todas_opiniones_bp,ver_Empleados_bp,agregar_libro_bp, ver_facturas_bp,ver_producto_bp,agregar_producto_bp, obtener_empleado_bp
from app.controllers.usuario_controller import agregar_usuario_bp, eliminar_usuario_bp,modificar_usuario_bp , usuario_bp #Lo borraron
from app.controllers.empleado_controller import ver_articulo_bp, generar_factura_bp, venta_bp,ticket_bp
from app.controllers.supervisor_controller import tickets_supervisor_bp    


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    app.register_blueprint(alerta_general_bp)
    app.register_blueprint(ver_supervisor_bp)
    app.register_blueprint(obtener_empleado_bp)
    app.register_blueprint(reporte_factura_bp)
    app.register_blueprint(reporte_ventas_bp)
    app.register_blueprint(reporte_ventas_periodo_bp)
    app.register_blueprint(mod_producto_bp)
    app.register_blueprint(eliminar_producto_bp)
    app.register_blueprint(ver_Empleados_bp)
    app.register_blueprint(agregar_libro_bp)
    app.register_blueprint(ver_producto_bp)
    app.register_blueprint(agregar_usuario_bp)
    app.register_blueprint(eliminar_usuario_bp)
    app.register_blueprint(modificar_empleado_bp)
    app.register_blueprint(modificar_libro_bp)
    app.register_blueprint(eliminar_libro_bp)
    app.register_blueprint(modificar_usuario_bp)
    app.register_blueprint(reporte_ganancias_bp)
    app.register_blueprint(ver_facturas_bp)
    app.register_blueprint(agregar_empleado_bp)
    app.register_blueprint(obtener_libro_bp)
    app.register_blueprint(agregar_producto_bp)
    app.register_blueprint(ver_todas_opiniones_bp)
    app.register_blueprint(ver_articulo_bp)
    app.register_blueprint(generar_factura_bp) #Lo borraron
    app.register_blueprint(usuario_bp) #Lo borraron
    app.register_blueprint(venta_bp) #Lo borraron
    app.register_blueprint(ticket_bp) #Lo borraron
    app.register_blueprint(tickets_supervisor_bp) 
    return app 