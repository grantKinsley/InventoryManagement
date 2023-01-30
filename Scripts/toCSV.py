import pandas as pd
from mongo_read import *


jsonString = find_all()
df = pd.DataFrame(jsonString)
df.pop("_id")
csv = df.to_csv('CSV_output.csv', index = False)