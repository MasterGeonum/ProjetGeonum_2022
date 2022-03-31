from flask import Flask, render_template
from flask import jsonify
from psycopg2 import connect
import json
import time

app = Flask(__name__,  template_folder='static')

#TOULOUSEBYNIGHT

#Erreur
@app.errorhandler(404)
def page_not_found(error):
   return render_template('404.html', title = '404'), 404

#Récupérer données de la page html indiquée apres le /
@app.route('/<path:path>')
def send_file(path):
    return app.send_static_file(path)

#Récupérer des données de la BDD en geojson
@app.route('/loisirs_final')
def loisir():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(loisirs_final.*)::json)
            ) as geojson
            from loisirs_final
            """)
        return cur.fetchone()[0]


@app.route('/public_final')
def public():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(public_final.*)::json)
            ) as geojson
            from public_final
            """)
        return cur.fetchone()[0]

@app.route('/entreprises_final')
def entreprise():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(entreprises_final.*)::json)
            ) as geojson
            from entreprises_final
            """)
        return cur.fetchone()[0]

@app.route('/commerces_final')
def commerce():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(commerces_final.*)::json)
            ) as geojson
            from commerces_final
            """)
        return cur.fetchone()[0]


@app.route('/residentiel_final')
def residentiel():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(residentiel_final.*)::json)
            ) as geojson
            from residentiel_final
            """)
        return cur.fetchone()[0]

@app.route('/zones_quartiers_finale')
def quartiers():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(zones_quartiers_finale.*)::json)
            ) as geojson
            from zones_quartiers_finale
            """)
        quartiers= cur.fetchone()[0]

        cur.execute("""select distinct libelle_des_grands_quartiers from zones_quartiers_finale""")

        quartiers_categ= [c[0] for c in cur.fetchall()]
        dict_prov = {"quartier": quartiers, "quartier_categ": quartiers_categ}
        json_final = json.dumps(dict_prov)
        return json_final
        # return jsonify(quartiers_categ) 
       

#LUMIERES NUITSIBLES

#Récupérer des données de la BDD en geojson
@app.route('/pollution_1992')
def pollution92():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(pollution_1992.*)::json)
            ) as geojson
            from pollution_1992
            """)
        return cur.fetchone()[0]


@app.route('/pollution_2002')
def pollution02():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(pollution_2002.*)::json)
            ) as geojson
            from pollution_2002
            """)
        return cur.fetchone()[0]

@app.route('/pollution_2013')
def pollution13():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(pollution_2013.*)::json)
            ) as geojson
            from pollution_2013
            """)
        return cur.fetchone()[0]

@app.route('/commune')
def communes():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(commune.*)::json)
            ) as geojson
            from commune
            """)
        return cur.fetchone()[0]


@app.route('/departements')
def departements():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(departements.*)::json)
            ) as geojson
            from departements
            """)
        return cur.fetchone()[0]


#UN AVIS SUR LA NUIT

#Récupérer des données de la BDD en geojson 

@app.route('/etoiles_opti_reproj')
def etoiles():
    with connect("dbname=nuit user=postgres password=postgres host=localhost port=5433") as con:
        cur = con.cursor()
        cur.execute("""
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(etoiles_opti_reproj.*)::json)
            ) as geojson
            from etoiles_opti_reproj
            """)
        etoiles = cur.fetchone()[0]
        return etoiles


app.run(host='0.0.0.0', port='5000', debug=True)

