from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL conexión MySQL
DATABASE_URL = "mysql+pymysql://root:Andrea%4099@localhost:3306/editorial_architect"
# sustituir @ de la contraseña por %40 para que mysql lo interprete bien (URL Encoding)

# motor conexión MySQL
engine = create_engine(DATABASE_URL)

# sesiones bbdd (cada request FastAPI es una sesión)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# clase base para modelos
Base = declarative_base()


# función conexiones base datos
def get_db():
    # creamos sesión SQL
    db = SessionLocal()
    try:
        # devuelve conexión temporalmente
        yield db
    finally:
        # termina petición, cierra conexión
        db.close()
