from flask import Flask, redirect, url_for, render_template, request, json
from psycopg2 import connect 
import requests 

app = Flask(__name__)

#Récupérer données de la page html indiquée apres le /
@app.route('/<path:path>')
def send_file(path):
    return app.send_static_file(path)


#Visualisation information formulaire 

@app.route('/forms')
def formulaire ():
    return render_template('formulaire.html')

#if __name__ == "__main__":
 #   app.run(debug=True)
@app.route('/requete', methods=['GET'])
def requete():
    dictionnaire = request.args.to_dict()
    for key, value in dictionnaire.items():
        if value == "1":
            dictionnaire[key] = 0.33
        elif value == "2":
            dictionnaire[key] = 0.66
        elif value == "3":
            dictionnaire[key] = 1
        elif value == "0":
            dictionnaire[key] = 0
        else:
            dictionnaire[key] = value
    print(dictionnaire)
    tc_temps = dictionnaire["campus"] + "_" + dictionnaire["transport"]
    
    nb_val_zero=0
    for key, value in dictionnaire.items():
        if value == 0:
            nb_val_zero += 1
    print(nb_val_zero)
   
    with connect("dbname=Etulogeou user=postgres password=****") as con:
        cur = con.cursor()
        cur.execute(f"""
        with t as (
            select
                    (
                        (restaurant * {dictionnaire["restaurant"]} +
                        alimentati * {dictionnaire["alimentation"]} +
                        parc * {dictionnaire["parc"]}+
                            (case 
                                when  {dictionnaire["densite"]} = 0.33 then (
                                    case
                                        when densite = 0.33 then 1
                                        when densite = 0.66 then 0.33
                                        when densite = 1 then 0
                                        end)
                                when  {dictionnaire["densite"]} = 0.66 then (
                                    case
                                        when densite = 0.33 then 0.33
                                        when densite = 0.66 then 1
                                        when densite = 1 then 0.33
                                        end)
                                when  {dictionnaire["densite"]} = 1 then (
                                    case
                                        when densite = 0.33 then 0
                                        when densite = 0.66 then 0.33
                                        when densite = 1 then 1
                                        end)
                                else 0
                                end) +
                        proximite * {dictionnaire["proximite"]}+
                        shopping * {dictionnaire["shopping"]}+ 
                        boulangeri *{dictionnaire["boulangerie"]} +
                        cinema * {dictionnaire["cinema"]}+
                        theatre * {dictionnaire["theatre"]} +
                        biblio * {dictionnaire["biblio"]}+
                        musee * {dictionnaire["musee"]}+ 
                        natation * {dictionnaire["natation"]}+ 
                        musique * {dictionnaire["musique"]}+ 
                        skate * {dictionnaire["skate"]} +
                        combat * {dictionnaire["combat"]} +
                        sportext * {dictionnaire["sportext"]}+
                        sportint * {dictionnaire["sportint"]}
                        )/(17-{nb_val_zero}) + 
                    (
                case 
                    when {dictionnaire["piece"]} < {dictionnaire["budget"]} then 1
                    when {dictionnaire["piece"]} < {dictionnaire["budget"]} + 100 then 0.5
                    else 0
                end
                ) + (
                case 
                    when {tc_temps} < {dictionnaire["temps"]}  then 1
                    when {tc_temps} < {dictionnaire["temps"]} + 5 then 0.66
                    when {tc_temps} < {dictionnaire["temps"]} + 10 then 0.33
                    else 0
                end
                ))/3
                as score_total,
                case 
                    when {tc_temps} < {dictionnaire["temps"]}  then 1
                    when {tc_temps} < {dictionnaire["temps"]} + 5 then 0.66
                    when {tc_temps} < {dictionnaire["temps"]} + 10 then 0.33
                    else 0
                end
                as score_t,
                (restaurant * {dictionnaire["restaurant"]} +
                        alimentati * {dictionnaire["alimentation"]} +
                        parc * {dictionnaire["parc"]}+
                            (case 
                                when  {dictionnaire["densite"]} = 0.33 then (
                                    case
                                        when densite = 0.33 then 1
                                        when densite = 0.66 then 0.33
                                        when densite = 1 then 0
                                        end)
                                when  {dictionnaire["densite"]} = 0.66 then (
                                    case
                                        when densite = 0.33 then 0.33
                                        when densite = 0.66 then 1
                                        when densite = 1 then 0.33
                                        end)
                                when  {dictionnaire["densite"]} = 1 then (
                                    case
                                        when densite = 0.33 then 0
                                        when densite = 0.66 then 0.33
                                        when densite = 1 then 1
                                        end)
                                else 0
                                end) +
                        proximite * {dictionnaire["proximite"]}+
                        shopping * {dictionnaire["shopping"]}+ 
                        boulangeri *{dictionnaire["boulangerie"]} +
                        cinema * {dictionnaire["cinema"]}+
                        theatre * {dictionnaire["theatre"]} +
                        biblio * {dictionnaire["biblio"]}+
                        musee * {dictionnaire["musee"]}+ 
                        natation * {dictionnaire["natation"]}+ 
                        musique * {dictionnaire["musique"]}+ 
                        skate * {dictionnaire["skate"]} +
                        combat * {dictionnaire["combat"]} +
                        sportext * {dictionnaire["sportext"]}+
                        sportint * {dictionnaire["sportint"]}
                        )/(17-{nb_val_zero})
                as score_cdv,
                case 
                    when {dictionnaire["piece"]} < {dictionnaire["budget"]} then 1
                    when {dictionnaire["piece"]} < {dictionnaire["budget"]} + 100 then 0.5
                    else 0
                end
                as score_l,
                {tc_temps} as transport, nom, {dictionnaire["piece"]} as loyer, type_{dictionnaire["piece"]} as piece,{dictionnaire["campus"]} as campus, geom from bd_elo_v7
        )
            select json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(ST_AsGeoJSON(t.*)::json)
            ) as geojson
            from t
            """)
        res = cur.fetchone()[0]
     
        with open('C:/Users/pauls/Applicatif/Applicatif/static/json/res.json','w',encoding='utf-8')as fichier:
            fichier.write(json.dumps(res))
        # print(res)
        #print(dictionnaire)
        return render_template('visualisation.html', res = '/res')
        #return res, 200, {'Content-Type': 'application/json; charset=utf-8'}

@app.route('/accueil')
def accueil ():
    return render_template('accueil.html')


#CheckBox
app.run(host='0.0.0.0', port='5000', debug=True)