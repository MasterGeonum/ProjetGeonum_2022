from flask import Flask, render_template, request
from psycopg2 import connect
import requests
import json
import geojson
import shapely.wkt

app = Flask(__name__)

#Informations de connexion à la BDD
conn = connect("dbname=postgres user=cendrine password=cendrine38")

#Récupère la page html indiquée apres le /
@app.route('/<path:path>')
def send_file(path):
    return app.send_static_file(path)



#Récupère les données de la BDD et les renvoie à la racine de notre route où notre carte "carte_lyon.html" s'affiche
@app.route('/')
def index():
    with conn as con:
        #Permet au code python d'exécuter une commande PostgreSQL dans une session de base de données
        cur = con.cursor()
        #Execute la requête SQL
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(colleges_rep.*)::json)
            ) as geojson
            from colleges_rep
            """) 
        #stock le résultat dans ma variable  
        colleges= cur.fetchall()

        cur.execute("""select distinct nom_college from colleges_rep order by nom_college asc""")
        ncolleges=[c for c, in cur.fetchall()]

        cur.execute("""select distinct domaine from offres order by domaine asc""")
        domaines=[d for d, in cur.fetchall()]

        return render_template("carte_lyon.html", colleges=colleges, ncolleges=ncolleges, domaines=domaines)


#Récupère une vue qui aggrège les infos des offres et des structures de la BDD en geojson
@app.route('/offres')
def geojson_1():
    with conn as con:
        cur = con.cursor()
        cur.execute("""
        with t as (
            select * from offres left join structures on offres.id_structure=structures.id_structure
        )
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(t.*)::json)
            ) as geojson
            from t
            """)
        offres = cur.fetchone()[0]
        return offres



#Récupérer données de la page html indiquée apres le /
@app.route('/test')
def iso():
    lat = request.args.get('lat')
    long = request.args.get('long')
    print(lat, long)
    url = "http://wxs.ign.fr/choisirgeoportail/isochrone/isochrone.json?location=" + long +"," + lat + "&method=Time&graphName=Pieton&exclusions=&time=900&holes=false&smoothing=true"
    
    
    response = requests.get(url)    

    dict = response.json()

    geomWKT=dict['wktGeometry']

    # Convert to a shapely.geometry.polygon.Polygon object
    g1 = shapely.wkt.loads(geomWKT)

    g2 = geojson.Feature(geometry=g1, properties={})

    # conversion en string
    result = geojson.dumps(g2)

    return result

        

app.run(host='0.0.0.0', port='5000', debug=True)
