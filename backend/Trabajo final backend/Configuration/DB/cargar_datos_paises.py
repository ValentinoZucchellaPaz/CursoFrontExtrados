import pytz
from datetime import datetime
import mysql.connector

def main():
    # config
    connection = mysql.connector.connect(
        host="localhost",
        user="admin",
        password="24122002",
        database="torneo_cartas"
    )
    cursor = connection.cursor()

    # Obtener la fecha base para calcular UTC offset
    base_date = datetime(2025, 1, 1)

    # Diccionario para evitar duplicados: { (country_name+offset): True }
    seen_offsets = {}

    # Recorrer los husos horarios y países
    for country_code, timezones in pytz.country_timezones.items():
        country_name = pytz.country_names.get(country_code, "Unknown")

        for timezone_name in timezones:
            timezone = pytz.timezone(timezone_name)

            # Calcular el UTC offset
            utc_offset = timezone.utcoffset(base_date)  # Devuelve un timedelta
            hours, remainder = divmod(utc_offset.total_seconds(), 3600)
            minutes = remainder // 60
            utc_offset_str = f"{int(hours):+03}:{int(minutes):02}"

            # Concatenar nombre del país con el offset

            # Evitar duplicados: solo guardamos si no se ha visto antes
            if (country_name+utc_offset_str) not in seen_offsets:
                seen_offsets[(country_name+utc_offset_str)] = True

                # Insertar en la base de datos
                cursor.execute("""
                    INSERT INTO paises (codigo, nombre)
                    VALUES (%s, %s);
                """, (country_code, country_name+utc_offset_str))

    # mandar transaccion y cerrar conexion
    connection.commit()
    cursor.close()
    connection.close()

if __name__ == "__main__":
    main()