#!/usr/bin/python
import sys

import Adafruit_DHT

# Parse command line parameters
if len(sys.argv) == 2:
    pin = sys.argv[1]
else:
    print('GPIO pin not provided')
    sys.exit(1)
    
humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, pin)

if humidity is not None and temperature is not None:
    print('{0:0.1f}'.format(temperature))
else:
    print('Failed to get reading. Try again!')
    sys.exit(1)
