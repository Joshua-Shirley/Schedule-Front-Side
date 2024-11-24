import datetime
import pytz

date = datetime.datetime.now()
dstAware = timezone.localize(date)
if date.tzinfo != pytz.utc:
    # if not change it to UTC            
    date = date.astimezone(pytz.utc)
format = "%Y-%m-%dT%H:%M:%S.%MZ"
utc = datetime.datetime.strftime(date, format).replace(".00Z",".000Z")

print(utc)  