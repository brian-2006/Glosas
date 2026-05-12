from fastapi import APIRouter, Depends
from app.services.Glosa import GlosaService

router = APIRouter(prefix="/glosa", tags=["glosas"])

@router.get("/list")
def get_glosas(service: GlosaService = Depends()):
    glosas = service.get_glosas()
    return glosas