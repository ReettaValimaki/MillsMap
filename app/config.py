import json, csv

secret_tokens = json.load(open('secret_tokens.json', 'r'))
email = secret_tokens['email']
password = secret_tokens['password']
aut = (email, password)
base_url = 'https://schooldataserver.tz'

mill_columns = ['coordinatesDescription_coodinates_coordinates', 'Food_purchases_foodtype']
# machine_columns = ['__id', '__Submissions-id',
#                    'commodity_milled',
#                    'mill_type', 'operational_mill',
#                    'energy_source', 'img_machines',
#                    'non_operational']
columns = {'Submissions': mill_columns}

submission_files_path = 'app/submission_files'
figures_path = 'app/static/figures'
update_time = 60 #time in seconds to check and update new submissions
id_columns = ['geo']
# Get the form configured data
# TODO: Do not create the form config file on the fly.
# This should be a database table ideally.
form_details = list()
with open('app/static/form_config.csv', newline='') as file:
    form_config = csv.DictReader(file)
    for row in form_config:
        form_details.append(row)
form_index = 0
projectId = form_details[form_index]['projectId']
formId = form_details[form_index]['formId']
lastNumberRecordsMills = form_details[form_index]['lastNumberRecordsMills']

# array_columns = ['non_operational', 'commodity_milled', 'energy_source']
# single_columns = ['Packaging_flour_fortified', 'operational_mill', 'interviewee_mill_owner', 'Packaging_flour_fortified_standard', 'mill_type']
