#!/usr/bin/python
# -*- coding: utf-8 -*-

import psycopg2
import sys
from  threading import Timer
import random


class PostgresHelper():
"""
Helper class for pgsql 
"""
    con = None

    def __init__(self):
    """
    Constructor for connecting on PGSQL database
    """
        try:
            self.con = psycopg2.connect(database='riskdoctor', user='riskdoctor', password='riskdoctor') 
            
        except psycopg2.DatabaseError, e:
            print 'Error %s' % e    
            sys.exit(1)


    def query_s(self, query = "SELECT id, ST_X(point) as lat, ST_Y(point) as lng FROM risk_management_site_car ORDER BY RANDOM() LIMIT 1"):
    """
    Method for SELECT random Car
    """
        cur = self.con.cursor()
        cur.execute(query)          
        return cur.fetchone()
            
    def query_u(self, query):
    """
    Method for executing query (UPDATE)
    """
        cur = self.con.cursor()
        cur.execute(query)          
        self.con.commit()
     
psql = PostgresHelper()

def checkLatLonValues(lat, lon):
    if(((lat >= -90) & (lat <= 90)) & (lon >= -180) & (lon <= 180)):
        return True
    return False

def periodicUpdate():
"""
Function for periodic UPDATE of car locations on map
"""
    global psql
    result_touple = psql.query_s()

    rand = random.randint(1,4)
    
    if(rand == 1):
        lat = result_touple[1] + 0.01
        lon = result_touple[2]

    elif(rand == 2):
        lat = result_touple[1]
        lon = result_touple[2] + 0.01

    elif(rand == 3):
        lat = result_touple[1]
        lon = result_touple[2] - 0.01

    elif(rand == 4):
        lat = result_touple[1] - 0.01
        lon = result_touple[2]

    if not checkLatLonValues(lat, lon):
        lat = result_touple[1] 
        lon = result_touple[2]
    
    random_id = result_touple[0]

    print random_id
    
    psql.query_u("UPDATE risk_management_site_car SET point=ST_SetSRID(ST_MakePoint(%s, %s), 4326), comming_location_date=(SELECT getdate()) WHERE id=%s" % (lat, lon, random_id))
    Timer(5, periodicUpdate).start()
        
if __name__ == "__main__":    
    periodicUpdate()
