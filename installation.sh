#!/bin/bash

sudo -u postgres createuser riskdoctor
sudo -u postgres createdb riskdoctor
sudo -u postgres psql -c "alter user riskdoctor with password 'riskdoctor'"
sudo -u postgres psql riskdoctor < backup.sql
