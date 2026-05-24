from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemResponse

# rutas
router = APIRouter()


### ENDPOINT POST /items, crear item
@router.post("/", response_model=ItemResponse)  # respuesta automática
# datos que llegan del frontend
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    # creamos objeto item
    new_item = Item(
        title=item.title,
        description=item.description,
        # usuario propietario
        owner_id=4,
    )
    # añadimos objeto a la sesión
    db.add(new_item)
    # guardamos cambios en mySQL
    db.commit()
    # recarga objeto, genera id automáticamente
    db.refresh(new_item)
    # FastAPI devuelve JSON
    return new_item


### ENDPOINT GET /items, obtener items
@router.get("/", response_model=list[ItemResponse])  # lista items
def get_items(db: Session = Depends(get_db)):  # ejecuta bd y sesión en bd
    # seleccionamos items
    items = db.query(Item).all()
    # devuelve lista JSON
    return items


### ENDPOINT GET /items/id, obtener item por id
@router.get("/{item_id}")
def get_item(
    item_id: int,  # parametro de la URL
    db: Session = Depends(get_db),  # conexión base datos
):
    # busca item cuyo id coincida, muestra el primero
    item = db.query(Item).filter(Item.id == item_id).first()

    # si no existe
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    # devuelve item encontrado
    return item


### ENDPOINT PUT /items/1, actualizar item
@router.put("/{item_id}")
def update_item(
    item_id: int,  # id de la URL
    updated_item: ItemCreate,  # nuevos datos enviados
    db: Session = Depends(get_db),  # conexión a base datos
):
    # busca item en la base datos
    item = db.query(Item).filter(Item.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    # actualiza
    item.title = updated_item.title
    item.description = updated_item.description
    db.commit()  # guarda cambios
    db.refresh(item)  # recarga item actualizado desde base datos
    return item  # devuelve item actualizado


### ENDPOINT DELETE /items/1, elimina item
@router.delete("/{item_id}")
def delete_item(
    item_id: int,  # id de la URL
    db: Session = Depends(get_db),  # conexión a la base de datos
):
    # busca item en la bd
    item = db.query(Item).filter(Item.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)  # selecciona item a eliminar
    db.commit()  # delete
    return {"message": "Item deleted successfully"}
