#importamos tipo de datos
from app.services.CuentaMedica import ResponseCuentaMedicaDTO
from app.services.Procedimiento import ResponseProcedimientoDTO
from app.models.cuentaMedica import CuentaMedica
from typing import List

def build_response_cuentas(
        cuentas: List[CuentaMedica]
    ) -> List[ResponseCuentaMedicaDTO]:

        response = []

        for cuenta in cuentas:

            procedimientos = []

            for proc in cuenta.procedimientos:

                procedimientos.append(
                    ResponseProcedimientoDTO(
                        id=proc.id,
                        id_catalogoprocedimiento=proc.id_catalogoprocedimiento,
                        nombre_procedimiento=proc.catalogo_procedimiento.nombre,
                        valor=proc.valor,
                        estado=proc.estado
                    )
                )

            response.append(
                ResponseCuentaMedicaDTO(
                    id=cuenta.id,
                    id_paciente=cuenta.id_paciente,
                    id_aseguradora=cuenta.id_aseguradora,
                    paciente=cuenta.paciente.nombre,
                    aseguradora=cuenta.aseguradora.nombre,
                    historiaclinica=cuenta.historiaclinica,
                    estado=cuenta.estado,
                    fecha=cuenta.fecha,
                    procedimientos=procedimientos
                )
            )

        return response
